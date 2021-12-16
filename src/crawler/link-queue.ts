const includes = require('lodash/includes');

class LinkQueue {
  queuedUrls: string[];

  constructor() {
    this.queuedUrls = [];
  }

  enqueue(url) {
    this.queuedUrls.push(url);
  }

  dequeue(url) {
    this.queuedUrls = this.queuedUrls.filter(item => item !== url)
  }

  alreadyQueued(url) {
    return includes(this.queuedUrls, url);
  }

  get length() {
    return this.queuedUrls.length;
  }
}

module.exports = LinkQueue;
