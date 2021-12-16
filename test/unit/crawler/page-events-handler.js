const { expect } = require('chai');
const PageEventsHandler = require('../../../dist/crawler/page-events-handler');

describe('PageEventsHandler', () => {
  describe('#pendingRequests', () => {
    beforeEach(() => {
      const page = {on(event, callback) {}};
      this.eventsHandler = new PageEventsHandler(page);
    });

    it('works when a request is pending', () => {
      const request = { resourceType() { return 'fetch' } };
      this.eventsHandler._handleRequest(request);

      expect(this.eventsHandler.pendingRequests.size).to.equal(1);
    });

    it('works when a request is complete', () => {
      const request = { resourceType() { return 'fetch' } };
      this.eventsHandler._handleRequest(request);
      this.eventsHandler._handleRequestfinished(request);

      expect(this.eventsHandler.pendingRequests.size).to.equal(0);
    });
  });
});
