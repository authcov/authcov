import { includes } from 'lodash/includes';
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
        return includes(this.queuedUrls, url);
    }
    get length() {
        return this.queuedUrls.length;
    }
}
//# sourceMappingURL=link-queue.js.map