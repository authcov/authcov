import Puppeteer from 'puppeteer';
import { Browser as PupBrowser, BrowserContext as PupContext, Page } from 'puppeteer';
import Config from '../config/config';

export default class Browser {
  puppeteer_browser: PupBrowser;
  puppeteer_context: PupContext;
  maxConcurrency: number;
  pendingRequests: number;
  browserLaunched: boolean;

  constructor(
    puppeteer_browser: PupBrowser,
    puppeteer_context: PupContext,
    maxConcurrency: number,
    browserLaunched: boolean
    ) {
    this.puppeteer_browser = puppeteer_browser;
    this.puppeteer_context = puppeteer_context;
    this.maxConcurrency = maxConcurrency;
    this.pendingRequests = 0;
    this.browserLaunched = browserLaunched;
  }

  static async init(config: Config) {
    const maxConcurrency = (config.maxConcurrency !== undefined) ? config.maxConcurrency : 10;
    let puppeteer_browser;
    let browserLaunched;

    if(config.browserURL !== undefined) {
      puppeteer_browser = await Puppeteer.connect({
        browserURL: config.browserURL
      });
      browserLaunched = false;

    } else if(config.browserWSEndpoint !== undefined) {
      puppeteer_browser = await Puppeteer.connect({
        browserWSEndpoint: config.browserWSEndpoint
      });
      browserLaunched = false;

    } else {
      puppeteer_browser = await Puppeteer.launch({
        headless: config.headless,
        args: ['--disable-web-security']
      });
      browserLaunched = true;
    }

    const puppeteer_context = await puppeteer_browser.createIncognitoBrowserContext();
    const browser = new Browser(puppeteer_browser, puppeteer_context, maxConcurrency, browserLaunched);
    return browser;
  }

  async resetContext(): Promise<void> {
    this.puppeteer_context.close();
    this.puppeteer_context = await this.puppeteer_browser.createIncognitoBrowserContext();
  }

  tabsAvailable(): boolean {
    return (this.pendingRequests < this.maxConcurrency);
  }

  async getTab(): Promise<Page> {
    const tab = this.puppeteer_context.newPage();
    return tab;
  }

  async disconnect(): Promise<void> {
    if(this.browserLaunched === true) {
      await this.puppeteer_browser.close();
    } else {
      await this.puppeteer_browser.disconnect();
    }
  }
}
