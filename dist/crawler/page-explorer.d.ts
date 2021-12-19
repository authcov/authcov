import { Page as PupPage } from 'puppeteer';
import PageData from '../data/page-data';
import Config from '../config/config';
export default class PageExplorer {
    page: PupPage;
    pageUrl: string;
    currentUser: string;
    config: Config;
    pageData: PageData;
    buttonsClicked: string[];
    constructor(page: PupPage, pageUrl: string, currentUser: string, config: Config, pageData: PageData);
    getLinks(): Promise<string[]>;
    _scrapeLinks(): Promise<string[]>;
    _pageClickButtons(buttons: any): Promise<void>;
    _verboseLog(message: any): void;
}
