export default class PageExplorer {
    page: any;
    pageUrl: string;
    currentUser: any;
    config: any;
    pageData: any;
    buttonsClicked: any[];
    constructor(page: any, pageUrl: any, currentUser: any, config: any, pageData: any);
    getLinks(): Promise<any>;
    _scrapeLinks(): Promise<any>;
    _pageClickButtons(buttons: any): Promise<void>;
    _verboseLog(message: any): void;
}
