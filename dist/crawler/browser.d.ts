import Puppeteer from 'puppeteer';
import { Browser as PupBrowser, BrowserContext as PupContext } from 'puppeteer';
import Config from '../config/config';
export default class Browser {
    puppeteer_browser: PupBrowser;
    puppeteer_context: PupContext;
    maxConcurrency: number;
    pendingRequests: number;
    browserLaunched: boolean;
    constructor(puppeteer_browser: PupBrowser, puppeteer_context: PupContext, maxConcurrency: number, browserLaunched: boolean);
    static init(config: Config): Promise<Browser>;
    resetContext(): Promise<void>;
    tabsAvailable(): boolean;
    getTab(): Promise<Puppeteer.Page>;
    disconnect(): Promise<void>;
}
