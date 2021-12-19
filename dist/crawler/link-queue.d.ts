export default class LinkQueue {
    queuedUrls: string[];
    constructor();
    enqueue(url: string): void;
    dequeue(url: string): void;
    alreadyQueued(url: string): boolean;
    get length(): number;
}
