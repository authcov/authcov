export default class LinkQueue {
  queuedUrls: string[];

  constructor() {
    this.queuedUrls = [];
  }

  enqueue(url: string): void {
    this.queuedUrls.push(url);
  }

  dequeue(url: string): void {
    this.queuedUrls = this.queuedUrls.filter(item => item !== url)
  }

  alreadyQueued(url: string): boolean {
    return this.queuedUrls.includes(url);
  }

  get length(): number {
    return this.queuedUrls.length;
  }
}
