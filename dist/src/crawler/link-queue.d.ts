export default class LinkQueue {
    queuedUrls: string[];
    constructor();
    enqueue(url: any): void;
    dequeue(url: any): void;
    alreadyQueued(url: any): any;
    get length(): number;
}
