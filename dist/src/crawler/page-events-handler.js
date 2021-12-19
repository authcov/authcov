export default class PageEventsHandler {
    constructor(page) {
        this.page = page;
        this.promises = [];
        this.pendingRequests = new Set();
        page.on('request', (request) => this._handleRequest(request));
        page.on('requestfailed', (request) => this._handleRequestFailed(request));
        page.on('requestfinished', (request) => this._handleRequestfinished(request));
    }
    async waitForRequestsToFinish(timeoutSeconds) {
        return Promise.race([
            this.waitForAllXhrFinished(),
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(undefined);
                }, timeoutSeconds * 1000);
            }),
        ]);
    }
    _handleRequest(request) {
        if (this._isXhr(request)) {
            //console.log(`PageEventsHandler: request made to ${request.url()}`)
            this.pendingRequests.add(request);
            const promise = new Promise(resolve => {
                request.resolver = resolve;
            });
            this.promises.push(promise);
        }
    }
    _handleRequestFailed(request) {
        if (this._isXhr(request)) {
            //console.log(`PageEventsHandler: request failed ${request.url()}`)
            this.pendingRequests.delete(request);
            if (request.resolver) {
                request.resolver();
                delete request.resolver;
            }
        }
    }
    _handleRequestfinished(request) {
        if (this._isXhr(request)) {
            //console.log(`PageEventsHandler: response from ${request.url()}`)
            this.pendingRequests.delete(request);
            if (request.resolver) {
                request.resolver();
                delete request.resolver;
            }
        }
    }
    async waitForAllXhrFinished() {
        if (this.pendingRequests.size === 0) {
            return;
        }
        await Promise.all(this.promises);
    }
    _isXhr(request) {
        return ['xhr', 'fetch'].includes(request.resourceType());
    }
}
//# sourceMappingURL=page-events-handler.js.map