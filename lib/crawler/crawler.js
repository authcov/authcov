const chalk = require('chalk');
const LinkQueue = require('./link-queue.js');
const Browser = require('./browser.js');
const PageExplorer = require('./page-explorer.js');
const PageEventsHandler = require('./page-events-handler.js');

const EventEmitter = require('events');
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
    this.config = options.config;
    this.processEvents = (options.processEvents === undefined) ? true : options.processEvents;

    if(this.processEvents === true) {
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
  }

  static async init(options={}) {
    const browser = await Browser.init(options.config);
    const crawler = new Crawler(browser, options);
    return crawler;
  }

  async close() {
    await this.browser.disconnect();
  }

  onIdle() {
    return new Promise(resolve => {
      this._resolveIdle = resolve;
    });
  }

  async login(username, password) {
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

  async logout() {
    const tab = await this.browser.getTab();
    return this.config.logoutFunction(tab);
  }

  handleRequest(request, sourceUrl) {
    const isXhr = ['xhr','fetch'].includes(request.resourceType());
    const ignoreRequest = this.config.ignoreApiRequest(
      request.url(),
      request.method()
    );

    this._verboseLog(`${sourceUrl} - HTTP request made to ${request.method()} ${request.url()}.`);

    if (isXhr && typeof(this.apiEndpointData) == 'object' && typeof(this.apiEndpointData.apiRequestCallback) == 'function' && !ignoreRequest) {
      this.apiEndpointData.apiRequestCallback(request, this.cookiesStr, sourceUrl, this.currentUser);
    }
    request.continue();
  }

  async handleResponse(response, sourceUrl) {
    const isXhr = ['xhr','fetch'].includes(response.request().resourceType());
    const ignoreRequest = this.config.ignoreApiRequest(
      response.url(),
      response.request().method()
    );

    this._verboseLog(`${sourceUrl} - HTTP response ${response.request().method()} ${response.request().url()}.`);

    if (isXhr && typeof(this.apiEndpointData) == 'object' && !ignoreRequest) {
      this.apiEndpointData.apiResponseCallback(response, this.cookiesStr, sourceUrl, this.currentUser);
    }
  }

  handleDialog(pageUrl, currentUser, dialog) {
    this.pageData.dialogCallback(pageUrl, currentUser, dialog);
    dialog.accept();
  }

  async startCrawling() {
    this.crawlPage(this.config.baseUrl, 0);
  }

  async crawlPage(url, depth) {
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
    const tab = await this.browser.getTab();
    this._verboseLog(`${url} - Got a tab.`);
    await tab.setRequestInterception(true);

    this._verboseLog(`${url} - Setting request interception`);

    tab.on('request', (request) => this.handleRequest(request, url));
    tab.on('response', (response) => this.handleResponse(response, url));
    tab.on('dialog', (dialog) => this.handleDialog(url, this.currentUser, dialog));
    this._verboseLog(`${url} - Going to url...`);

    const pageEvents = new PageEventsHandler(tab);

    try {
      const pageResponse = await tab.goto(url);
      this._verboseLog(`${url} - Got a response.`);

      // If this is an MPA then the page itself needs to be recorded in api_requests.json too
      if (this.config.type == 'mpa' && typeof(this.apiEndpointData) == 'object' && typeof(this.apiEndpointData.apiResponseCallback) == 'function') {
        this.apiEndpointData.mpaPageResponseCallback(pageResponse, this.cookiesStr, url, this.currentUser);
      }

      // Wait until timeout limit for XHR
      await pageEvents.waitForRequestsToFinish(this.config.xhrTimeout);

      this._verboseLog(`${url} - Finished waiting for XHR requests or they have all completed.`);
      await tab.waitFor(500);

      if(this.config.saveScreenshots === true) {
        try {
          await tab.screenshot({path: `./tmp/report/screenshots/${id}.png`})
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

      this._verboseLog(`${url} - Got ${links.length} links from PageExplorer...`);
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
  }

  processLink(links, depth) {
    links.forEach((link) => {
      link = this.resolveUrl(link, this.config.baseUrl);

      if(link == null) {
        return;
      }

      const notAlreadyVisted = !includes(this.visitedUrls, link);
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
    if(typeof(this.config) == 'object' && typeof(this.config.ignoreLink) == 'function') {
      return this.config.ignoreLink(url);
    } else {
      return false;
    }
  }

  complete() {
    return !(this.linkQueue.length > 0 || this.browser.pendingRequests > 0 );
  }

  _verboseLog(message) {
    if(this.config.verboseOutput === true) {
      console.log(message);
    }
  }
}

module.exports = Crawler;
