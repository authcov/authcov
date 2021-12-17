export default class LinkQueue {
    constructor() {
        this.queuedUrls = [];
    }
    enqueue(url) {
        this.queuedUrls.push(url);
    }
    dequeue(url) {
        this.queuedUrls = this.queuedUrls.filter(item => item !== url);
    }
    alreadyQueued(url) {
        return this.queuedUrls.includes(url);
    }
    get length() {
        return this.queuedUrls.length;
    }
}
//# sourceMappingURL=link-queue.js.map