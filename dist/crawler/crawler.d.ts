/// <reference types="node" />
import LinkQueue from './link-queue';
import Browser from './browser';
import ApiEndpointData from '../data/api-endpoint-data';
import PageData from '../data/page-data';
import { EventEmitter } from 'events';
export default class Crawler {
    browser: Browser;
    events: EventEmitter;
    linkQueue: LinkQueue;
    visitedUrls: string[];
    _resolveIdle: any;
    currentUser: string;
    apiEndpointData: ApiEndpointData;
    pageData: PageData;
    config: any;
    processEvents: boolean;
    cookiesStr: string;
    constructor(browser: Browser, options: any);
    static init(options: any): Promise<Crawler>;
    close(): Promise<void>;
    onIdle(): Promise<unknown>;
    login(username: any, password: any): Promise<void>;
    logout(): Promise<any>;
    handleRequest(request: any, sourceUrl: any): void;
    handleResponse(response: any, sourceUrl: any): Promise<void>;
    handleDialog(pageUrl: any, currentUser: any, dialog: any): void;
    startCrawling(): Promise<void>;
    crawlPage(url: any, depth: any): Promise<void>;
    processLink(links: any, depth: any): void;
    resolveUrl(url: any, baseUrl: any): any;
    ignoreLink(url: any): any;
    complete(): boolean;
    _verboseLog(message: any): void;
}
