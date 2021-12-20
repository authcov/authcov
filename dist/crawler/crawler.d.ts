/// <reference types="node" />
import LinkQueue from './link-queue';
import Browser from './browser';
import ApiEndpointsCollection from '../data/api-endpoints-collection';
import PageData from '../data/page-data';
import Config from '../config/config';
import { EventEmitter } from 'events';
export default class Crawler {
    browser: Browser;
    events: EventEmitter;
    linkQueue: LinkQueue;
    visitedUrls: string[];
    _resolveIdle: any;
    currentUser: string;
    apiEndpointData: ApiEndpointsCollection;
    pageData: PageData;
    config: Config;
    processEvents: boolean;
    cookiesStr: string;
    constructor(browser: Browser, options: any);
    static init(options: any): Promise<Crawler>;
    close(): Promise<void>;
    onIdle(): Promise<unknown>;
    login(username: any, password: any): Promise<void>;
    handleRequest(request: any, sourceUrl: any): void;
    handleResponse(response: any, sourceUrl: any): Promise<void>;
    handleDialog(pageUrl: any, currentUser: any, dialog: any): void;
    startCrawling(): Promise<void>;
    crawlPage(url: any, depth: any): Promise<void>;
    processLink(links: any, depth: any): void;
    resolveUrl(url: any, baseUrl: any): any;
    ignoreLink(url: any): boolean;
    complete(): boolean;
    _verboseLog(message: any): void;
}
