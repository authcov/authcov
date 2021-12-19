import { Page as PupPage } from 'puppeteer';
import PageData from '../data/page-data';
export default class PageExplorer {
    page: PupPage;
    pageUrl: string;
    currentUser: string;
    config: any;
    pageData: PageData;
    buttonsClicked: string[];
    constructor(page: PupPage, pageUrl: string, currentUser: string, config: any, pageData: PageData);
    getLinks(): Promise<string[]>;
    _scrapeLinks(): Promise<string[]>;
    _pageClickButtons(buttons: any): Promise<void>;
    _verboseLog(message: any): void;
}
