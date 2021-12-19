export default class PageData {
    config: any;
    pages: any[];
    constructor(options: any);
    loadFile(filePath: any): void;
    saveToFile(fileName: any): void;
    pageCrawledCallback(pageUrl: any, id: any, currentUser: any): void;
    buttonIgnoredCallback(pageUrl: any, buttonHTML: any, currentUser: any): void;
    buttonClickedCallback(pageUrl: any, buttonHTML: any, currentUser: any): void;
    dialogCallback(pageUrl: any, currentUser: any, dialog: any): void;
    findPage(pageUrl: any, user: any): any;
}
