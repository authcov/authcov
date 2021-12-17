export default class LinkQueue {
    queuedUrls: string[];
    constructor();
    enqueue(url: any): void;
    dequeue(url: any): void;
    alreadyQueued(url: any): boolean;
    get length(): number;
}
