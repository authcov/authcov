const Puppeteer = require('puppeteer-core');

class Browser {
  constructor(puppeteer_browser, puppeteer_context, maxConcurrency) {
    this.puppeteer_browser = puppeteer_browser;
    this.puppeteer_context = puppeteer_context;
    this.maxConcurrency = maxConcurrency;
    this.pendingRequests = 0;
  }

  static async init(options={}) {
    const maxConcurrency = (options.maxConcurrency !== undefined) ? options.maxConcurrency : 10;
    const puppeteer_browser = await Puppeteer.connect({
      browserURL: 'http://localhost:9222'
    });
    const puppeteer_context = await puppeteer_browser.createIncognitoBrowserContext();
    const browser = new Browser(puppeteer_browser, puppeteer_context, maxConcurrency);
    return browser;
  }

  async resetContext() {
    this.puppeteer_context.close();
    this.puppeteer_context = await this.puppeteer_browser.createIncognitoBrowserContext();
  }

  tabsAvailable() {
    return (this.pendingRequests < this.maxConcurrency);
  }

  async getTab() {
    const tab = this.puppeteer_context.newPage();
    return tab;
  }

  async disconnect() {
    return this.puppeteer_browser.disconnect();
  }
}

module.exports = Browser;
