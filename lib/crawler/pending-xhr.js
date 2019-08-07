class PendingXHR {
  constructor(page) {
    this.page = page;
    this.promises = [];
    this.pendingXhrs = new Set();

    page.on('request', (request) => {
      if(this._isXhr(request)) {
        this.pendingXhrs.add(request);

        const promise = new Promise(resolve => {
          request.resolver = resolve;
        });

        this.promises.push(promise);
      }
    });

    page.on('requestfailed', (request) => {
      if(this._isXhr(request)) {
        this.pendingXhrs.delete(request);

        if(request.resolver) {
          request.resolver();
          delete request.resolver;
        }
      }
    });

    page.on('requestfinished', (request) => {
      if(this._isXhr(request)) {
        this.pendingXhrs.delete(request);

        if(request.resolver) {
          request.resolver();
          delete request.resolver;
        }
      }
    });
  }

  async waitForAllXhrFinished() {
    if (this.pendingXhrs.length === 0) {
      return;
    }
    await Promise.all(this.promises);
  }

  _isXhr(request) {
    return ['xhr','fetch'].includes(request.resourceType());
  }
}

module.exports = PendingXHR;
