const { expect } = require('chai');
import { describe, beforeEach, it } from 'mocha';
import PageEventsHandler from '../../../src/crawler/page-events-handler';
describe('PageEventsHandler', () => {
    describe('#pendingRequests', () => {
        let eventsHandler;
        beforeEach(() => {
            const page = { on(event, callback) { } };
            eventsHandler = new PageEventsHandler(page);
        });
        it('works when a request is pending', () => {
            const request = { resourceType() { return 'fetch'; } };
            eventsHandler._handleRequest(request);
            expect(eventsHandler.pendingRequests.size).to.equal(1);
        });
        it('works when a request is complete', () => {
            const request = { resourceType() { return 'fetch'; } };
            eventsHandler._handleRequest(request);
            eventsHandler._handleRequestfinished(request);
            expect(eventsHandler.pendingRequests.size).to.equal(0);
        });
    });
});
//# sourceMappingURL=page-events-handler.js.map