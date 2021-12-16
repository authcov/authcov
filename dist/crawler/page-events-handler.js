var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PageEventsHandler {
    constructor(page) {
        this.page = page;
        this.promises = [];
        this.pendingRequests = new Set();
        page.on('request', (request) => this._handleRequest(request));
        page.on('requestfailed', (request) => this._handleRequestFailed(request));
        page.on('requestfinished', (request) => this._handleRequestfinished(request));
    }
    waitForRequestsToFinish(timeoutSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.race([
                this.waitForAllXhrFinished(),
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve(undefined);
                    }, timeoutSeconds * 1000);
                }),
            ]);
        });
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
    waitForAllXhrFinished() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pendingRequests.size === 0) {
                return;
            }
            yield Promise.all(this.promises);
        });
    }
    _isXhr(request) {
        return ['xhr', 'fetch'].includes(request.resourceType());
    }
}
module.exports = PageEventsHandler;
