import chalk from 'chalk';
import LinkQueue from './link-queue';
import Browser from './browser';
import PageExplorer from './page-explorer';
import PageEventsHandler from './page-events-handler';
import ApiEndpointsCollection from '../data/api-endpoints-collection';
import PageData from '../data/page-data';
import Config from '../config/config';

import { Page, HTTPRequest, HTTPResponse, Dialog } from 'puppeteer';
import { EventEmitter } from 'events';
import { parse, resolve } from 'url';
import trim from 'lodash/trim';
import startsWith from 'lodash/startsWith';
import noop from 'lodash/noop';
import { v4 as uuid } from 'uuid';

export default class Crawler {
  browser: Browser;
  events: EventEmitter;
  linkQueue: LinkQueue;
  visitedUrls: string[];
  _resolveIdle: any;
  currentUser: string;
  apiEndpointData: ApiEndpointsCollection;
  pageData: PageData;
  config: Config;
  processEvents: boolean;
  cookiesStr: string;

  constructor(browser: Browser, apiEndpointData: ApiEndpointsCollection, pageData: PageData, config: Config) {
    this.browser = browser;
    this.events = new EventEmitter();
    this.linkQueue = new LinkQueue();
    this.visitedUrls = [];
    this._resolveIdle = noop;
    this.currentUser = 'Public';

    this.apiEndpointData = apiEndpointData;
    this.pageData = pageData;
    this.config = config;

    this.events.on('url queued', (urlObj) => {
      if(this.browser.tabsAvailable()) {
        this.linkQueue.dequeue(urlObj.url);
        this.crawlPage(urlObj.url, urlObj.depth);
      } else {
        setTimeout(() => {
          this.events.emit('url queued', urlObj);
        }, 100);
      }
    });
  }

  static async init(apiEndpointData: ApiEndpointsCollection, pageData: PageData, config: Config): Promise<Crawler> {
    const browser = await Browser.init(config);
    const crawler = new Crawler(browser, apiEndpointData, pageData, config);
    return crawler;
  }

  async close(): Promise<void> {
    await this.browser.disconnect();
  }

  onIdle(): Promise<void> {
    return new Promise(resolve => {
      this._resolveIdle = resolve;
    });
  }

  async login(username: string, password: string): Promise<void> {
    this.currentUser = username;

    const tab = await this.browser.getTab();
    console.log(`Logging in as ${username}...`);
    await this.config.loginFunction(tab, username, password);
    console.log(chalk.green('Logged in.'));

    // Hack: request.headers() does not include Cookies so we have to manually save them from the login request
    //       and then send them back to apiEndpointData
    const cookies = await tab.cookies();
    this.cookiesStr = cookies.map((cookie) => { return `${cookie.name}=${cookie.value}`; }).join('; ');

    await tab.close();
  }

  handleRequest(request: HTTPRequest, sourceUrl: string) {
    const isXhr = ['xhr','fetch'].includes(request.resourceType());
    const ignoreRequest = this.config.ignoreApiRequest(
      request.url(),
      request.method()
    );

    this._verboseLog(`${sourceUrl} - HTTP request made to ${request.method()} ${request.url()}.`);

    if (isXhr && typeof(this.apiEndpointData.apiRequestCallback) == 'function' && !ignoreRequest) {
      this.apiEndpointData.apiRequestCallback(request, this.cookiesStr, sourceUrl, this.currentUser);
    }
    request.continue();
  }

  async handleResponse(response: HTTPResponse, sourceUrl: string) {
    const isXhr = ['xhr','fetch'].includes(response.request().resourceType());
    const ignoreRequest = this.config.ignoreApiRequest(
      response.url(),
      response.request().method()
    );

    this._verboseLog(`${sourceUrl} - HTTP response ${response.request().method()} ${response.request().url()}.`);

    if (isXhr && !ignoreRequest) {
      this.apiEndpointData.apiResponseCallback(response, this.cookiesStr, sourceUrl, this.currentUser);
    }
  }

  handleDialog(pageUrl: string, currentUser: string, dialog: Dialog) {
    this.pageData.dialogCallback(pageUrl, currentUser, dialog);
    dialog.accept();
  }

  async startCrawling(): Promise<void> {
    this.crawlPage(this.config.baseUrl, 0);
  }

  async crawlPage(url: string, depth: number): Promise<void> {
    if(depth > this.config.maxDepth) {
      return;
    }

    this.browser.pendingRequests++;
    this.visitedUrls.push(url);
    const id = uuid();
    this.pageData.pageCrawledCallback(url, id, this.currentUser);

    // Start a monitor process so we can identify pages which are stuck
    let seconds = 0;
    const monitorProcess = setInterval(() => {
      if(seconds >= 10 && (seconds % 5) == 0) {
        console.log(chalk.yellow(`WARN: Been crawling ${url} for ${seconds} seconds`));
      }

      seconds++;
    }, 1000);

    this._verboseLog(`${depth}. Crawling ${url}`);

    // Open a new tab at this url with Network request interception enabled
    const tab: Page = await this.browser.getTab();
    this._verboseLog(`${url} - Got a tab.`);
    await tab.setRequestInterception(true);

    this._verboseLog(`${url} - Setting request interception`);

    tab.on('request', (request: HTTPRequest) => this.handleRequest(request, url));
    tab.on('response', (response: HTTPResponse) => this.handleResponse(response, url));
    tab.on('dialog', (dialog: Dialog) => this.handleDialog(url, this.currentUser, dialog));
    this._verboseLog(`${url} - Going to url...`);

    const pageEvents = new PageEventsHandler(tab);

    try {
      const pageResponse = await tab.goto(url);
      this._verboseLog(`${url} - Got a response.`);

      // If this is an MPA then the page itself needs to be recorded in api_requests.json too
      if (this.config.type == 'mpa' && this.apiEndpointData.apiResponseCallback) {
        this.apiEndpointData.mpaPageResponseCallback(pageResponse, this.cookiesStr, url, this.currentUser);
      }

      // Wait until timeout limit for XHR
      await pageEvents.waitForRequestsToFinish(this.config.xhrTimeout);

      this._verboseLog(`${url} - Finished waiting for XHR requests or they have all completed.`);
      await tab.waitForTimeout(500);

      if(this.config.saveScreenshots === true) {
        try {
          await tab.screenshot({path: `./report/screenshots/${id}.png`})
        } catch(err) {
          console.log(`Could not save screenshot for ${url}`);
          console.log(err);
        }
      }

      // Gather & process links from the page
      this._verboseLog(`${url} - Launching PageExplorer...`);
      const pageExplorer = new PageExplorer(tab, url, this.currentUser, this.config, this.pageData);
      const links = await pageExplorer.getLinks();

      if(this.config.clickButtons === true) {
        await pageEvents.waitForRequestsToFinish(this.config.xhrTimeout);
      }

      this._verboseLog(`${url} - Got links from PageExplorer...`);
      await tab.close();
      this._verboseLog(`${url} -Tab closed.`);

      this._verboseLog(`${url} - Processing links...`);
      this.processLink(links, depth);
      this._verboseLog(`${url} - Done Processing links.`);

    } catch(error) {
      console.log(chalk.red(`ERROR: ${url} - Could not process:`));
      console.log(chalk.red(error.message));
      // TODO: Save the error state to pages.json

    } finally {

      this.browser.pendingRequests--;
      clearInterval(monitorProcess);

      this.apiEndpointData.urlCrawledCallback(url);

      // Check if the crawler is complete
      if(this.complete()) {
        this._resolveIdle();

        this.apiEndpointData.scanCompleteCallback();
      }
    }
  }

  processLink(links: string[], depth: number): void {
    links.forEach((link) => {
      link = this.resolveUrl(link, this.config.baseUrl);

      if(link == null) {
        return;
      }

      const notAlreadyVisted = !this.visitedUrls.includes(link);
      const notAlreadyQueued = !this.linkQueue.alreadyQueued(link);
      const ignoreLink = this.ignoreLink(link);

      if(link !== null && notAlreadyVisted && notAlreadyQueued && !ignoreLink) {
        this._verboseLog(`Queued link: ${link}`)
        this.linkQueue.enqueue(link);
        this.events.emit('url queued',{url: link, depth: depth+1});
      } else {
        this._verboseLog(`Ignoring link: ${link}`)
      }
    });
  }

  resolveUrl(url: string, baseUrl: string): string {
    url = trim(url);
    if (!url) return null;
    if (startsWith(url, '#')) return null;
    const { protocol } = parse(url);
    if (['http:', 'https:'].includes(protocol)) {
      return url.split('#')[0];
    } else if (!protocol) { // eslint-disable-line no-else-return
      return resolve(baseUrl, url).split('#')[0];
    }
    return null;
  }

  ignoreLink(url: string): boolean {
    if(typeof(this.config.ignoreLink) == 'function') {
      return this.config.ignoreLink(url);
    } else {
      return false;
    }
  }

  complete(): boolean {
    return !(this.linkQueue.length > 0 || this.browser.pendingRequests > 0 );
  }

  _verboseLog(message: string): void {
    if(this.config.verboseOutput === true) {
      console.log(message);
    }
  }
}
