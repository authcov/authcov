const LinkQueue = require('./link-queue.js');
const Browser = require('./browser.js');
const PageExplorer = require('./page-explorer.js');

const EventEmitter = require('events');
const { PendingXHR } = require('pending-xhr-puppeteer');
const { parse, resolve } = require('url');
const trim = require('lodash/trim');
const startsWith = require('lodash/startsWith');
const includes = require('lodash/includes');
const noop = require('lodash/noop');
const uuid = require('uuid/v4');

class Crawler {
  constructor(browser, options) {
    this.browser = browser;
    this.events = new EventEmitter();
    this.linkQueue = new LinkQueue();
    this.visitedUrls = [];
    this._resolveIdle = noop;
    this.currentUser = 'Public';

    this.apiEndpointData = options.apiEndpointData;
    this.pageData = options.pageData;
    this.webAppConfig = options.webAppConfig;
    this.processEvents = (options.processEvents === undefined) ? true : options.processEvents;

    if(this.processEvents === true) {
      this.events.on('url queued', (url) => {
        if(this.browser.tabsAvailable()) {
          this.linkQueue.dequeue(url);
          this.crawlPage(url);
        } else {
          setTimeout(() => {
            this.events.emit('url queued', url);
          }, 100);
        }
      });
    }
  }

  static async init(options={}) {
    const browser = await Browser.init({
      apiEndpointData: options.apiEndpointData,
      pageData: options.pageData,
      webAppConfig: options.webAppConfig,
      maxConcurrency: options.maxConcurrency,
      processEvents: options.processEvents // Useful for testing
    });
    const crawler = new Crawler(browser, options);
    return crawler;
  }

  async close() {
    await this.browser.puppeteer_browser.disconnect();
  }

  onIdle() {
    return new Promise(resolve => {
      this._resolveIdle = resolve;
    });
  }

  async login(username, password) {
    this.currentUser = username;

    const tab = await this.browser.getTab();
    await this.webAppConfig.loginFunction(tab, username, password);

    // Hack: request.headers() does not include Cookies so we have to manually save them from the login request
    //       and then send them back to apiEndpointData
    const cookies = await tab.cookies();
    this.cookiesStr = cookies.map((cookie) => { return `${cookie.name}=${cookie.value}`; }).join('; ');

    await tab.close();
    console.log('Done.');
  }

  async logout() {
    const tab = await this.browser.getTab();
    return this.webAppConfig.logoutFunction(tab);
  }

  handleRequest(request, sourceUrl) {
    const isXhr = ['xhr','fetch'].includes(request.resourceType());
    const ignoreRequest = this.webAppConfig.ignoreApiRequest(
      request.url(),
      request.method()
    );

    if (isXhr && typeof(this.apiEndpointData) == 'object' && typeof(this.apiEndpointData.apiRequestCallback) == 'function' && !ignoreRequest) {
      this.apiEndpointData.apiRequestCallback(request, this.cookiesStr, sourceUrl, this.currentUser);
    }
    request.continue();
  }

  async handleResponse(response, sourceUrl) {
    const isXhr = ['xhr','fetch'].includes(response.request().resourceType());
    const ignoreRequest = this.webAppConfig.ignoreApiRequest(
      response.url(),
      response.request().method()
    );

    if (isXhr && typeof(this.apiEndpointData) == 'object' && !ignoreRequest) {
      this.apiEndpointData.apiResponseCallback(response, this.cookiesStr, sourceUrl, this.currentUser);
    }
  }

  handleDialog(pageUrl, currentUser, dialog) {
    this.pageData.dialogCallback(pageUrl, currentUser, dialog);
    dialog.accept();
  }

  async startCrawling() {
    this.crawlPage(this.webAppConfig.baseUrl);
  }

  async crawlPage(url) {
    this.browser.pendingRequests++;
    this.visitedUrls.push(url);
    const id = uuid();
    this.pageData.pageCrawledCallback(url, id, this.currentUser);

    // Start a monitor process so we can identify pages which are stuck
    let seconds = 0;
    const monitorProcess = setInterval(() => {
      if(seconds >= 10 && (seconds % 5) == 0) {
        console.log(`WARN: Been crawling ${url} for ${seconds} seconds`);
      }

/*
      if(seconds == 10) {
        tab.screenshot({ path: './tmp/screenshot.png', fullPage: true });
      }
*/
      seconds++;
    }, 1000);

    console.log(`Crawling ${url}`);

    // Open a new tab at this url with Network request interception enabled
    const tab = await this.browser.getTab();
    await tab.setRequestInterception(true);

    tab.on('request', (request) => this.handleRequest(request, url));
    tab.on('response', (response) => this.handleResponse(response, url));
    tab.on('dialog', (dialog) => this.handleDialog(url, this.currentUser, dialog));

    const pendingXHR = new PendingXHR(tab);
    const pageResponse = await tab.goto(url);

    // If this is an MPA then the page itself needs to be recorded in api_requests.json too
    if (this.webAppConfig.type == 'mpa' && typeof(this.apiEndpointData) == 'object' && typeof(this.apiEndpointData.apiResponseCallback) == 'function') {
      this.apiEndpointData.apiResponseCallback(pageResponse, this.cookiesStr, url, this.currentUser);
    }

    if(this.webAppConfig.saveScreenshots === true) {
      try {
        await tab.screenshot({path: `./tmp/screenshots/${id}.png`})
      } catch(err) {
        console.log(`Could not save screenshot for ${url}`);
        console.log(err);
      }
    }

    // Wait max 10 seconds for xhrs
    await Promise.race([
      pendingXHR.waitForAllXhrFinished(),
      new Promise(resolve => {
        setTimeout(resolve, 5000);
      }),
    ]);
    await tab.waitFor(1000);

    // Gather & process links from the page
    const pageExplorer = new PageExplorer(tab, url, this.currentUser, this.webAppConfig, this.pageData);
    const links = await pageExplorer.getLinks();
    this.processLink(links);

    // Close the tab
    await tab.close();
    this.browser.pendingRequests--;
    clearInterval(monitorProcess);

    if(typeof(this.apiEndpointData) == 'object') {
      this.apiEndpointData.urlCrawledCallback(url);
    }


    // Check if the crawler is complete
    if(this.complete()) {
      this._resolveIdle();

      if(typeof(this.apiEndpointData) == 'object' && typeof(this.apiEndpointData.scanCompleteCallback) == 'function') {
        this.apiEndpointData.scanCompleteCallback();
      }
    }
  }

  processLink(links) {
    links.forEach((link) => {
      link = this.resolveUrl(link, this.webAppConfig.baseUrl);

      const notAlreadyVisted = !includes(this.visitedUrls, link);
      const notAlreadyQueued = !this.linkQueue.alreadyQueued(link);
      const ignoreLink = this.ignoreLink(link);

      if(link !== null && notAlreadyVisted && notAlreadyQueued && !ignoreLink) {
        this.linkQueue.enqueue(link);
        this.events.emit('url queued', link);
      }
    });
  }

  resolveUrl(url, baseUrl) {
    url = trim(url);
    if (!url) return null;
    if (startsWith(url, '#')) return null;
    const { protocol } = parse(url);
    if (includes(['http:', 'https:'], protocol)) {
      return url.split('#')[0];
    } else if (!protocol) { // eslint-disable-line no-else-return
      return resolve(baseUrl, url).split('#')[0];
    }
    return null;
  }

  ignoreLink(url) {
    if(typeof(this.webAppConfig) == 'object' && typeof(this.webAppConfig.ignoreLink) == 'function') {
      return this.webAppConfig.ignoreLink(url);
    } else {
      return false;
    }
  }

  complete() {
    return !(this.linkQueue.length > 0 || this.browser.pendingRequests > 0 );
  }
}

module.exports = Crawler;
