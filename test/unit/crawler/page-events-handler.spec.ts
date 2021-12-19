import { Page as PupPage } from 'puppeteer';
import PageEventsHandler from '../../../src/crawler/page-events-handler';

jest.mock('puppeteer', () => {
  return {
    Page: jest.fn().mockImplementation(() => {
      return { on: () => {} };
    }),
  };
});

describe('PageEventsHandler', () => {
  describe('#pendingRequests', () => {
    let eventsHandler;

    beforeEach(() => {
      // @ts-ignore
      const page = new PupPage();
      eventsHandler = new PageEventsHandler(page);
    });

    it('works when a request is pending', () => {
      const request = { resourceType() { return 'fetch' } };
      eventsHandler._handleRequest(request);

      expect(eventsHandler.pendingRequests.size).toEqual(1);
    });

    it('works when a request is complete', () => {
      const request = { resourceType() { return 'fetch' } };
      eventsHandler._handleRequest(request);
      eventsHandler._handleRequestfinished(request);

      expect(eventsHandler.pendingRequests.size).toEqual(0);
    });
  });
});
