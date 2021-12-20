import ApiEndpointsCollection from '../../../src/data/api-endpoints-collection';
import Config from '../../../src/config/config';

describe('ApiEndpointsCollection', () => {
  describe('#findAuthorisationHeadersForUsername()', () => {
    let apiEndpointData;

    beforeEach(() => {
      const configArgs = {
        authorisationHeaders: ['authorization'],
        responseIsAuthorised: (response, body) => { return true; }
      }
      const config = new Config(configArgs);
      apiEndpointData = new ApiEndpointsCollection(config);
      apiEndpointData.loadFile('./test/unit/fixtures/api_endpoints.json');
    });

    it('should return apiRequests for Public', () => {
      const headers = apiEndpointData.findAuthorisationHeadersForUsername('Public');
      expect(headers).toMatchObject({});
    });

    it('should return apiRequests for evanrolfe@gmail.com', () => {
      const headers = apiEndpointData.findAuthorisationHeadersForUsername('evanrolfe@gmail.com');
      expect(headers['authorization']).toEqual('EVANROLFE_GMAIL_AUTHTOKEN');
    });

    it('should return apiRequests for evanrolfe@onescan.io', () => {
      const headers = apiEndpointData.findAuthorisationHeadersForUsername('evanrolfe@onescan.io');
      expect(headers['authorization']).toEqual('EVANROLFE_ONESCAN_AUTHTOKEN');
    });
  });

  describe('#findIntrusionRequestsForUsername()', () => {
    let apiEndpointData;

    beforeEach(() => {
      const configArgs = {
        authorisationHeaders: ['authorization'],
        responseIsAuthorised: (response, body) => { return true; }
      }
      const config = new Config(configArgs);
      apiEndpointData = new ApiEndpointsCollection(config);
      apiEndpointData.loadFile('./test/unit/fixtures/api_endpoints.json');
    });

    it('should return intrusionRequests for Public', () => {
      const intruderHeaders = {};
      const intrusionRequests = apiEndpointData.findIntrusionRequestsForUsername('Public', intruderHeaders);
      const urls = intrusionRequests.map(intrusionRequest => intrusionRequest.url);

      intrusionRequests.forEach((intrusionRequest) => {
        expect(intrusionRequest.headers.authorization).toEqual(undefined);
      });
      expect(urls).toMatchObject([
        'http://localhost:3001/secrets/1.json',
        'http://localhost:3001/secrets/4.json',
        'http://localhost:3001/secrets/116.json',
        'http://localhost:3001/secrets/117.json',
        'http://localhost:3001/secrets/118.json'
      ]);
    });

    it('should return intrusionRequests for evanrolfe@onescan.io', () => {
      const intruderHeaders = {'authorization': 'EVANROLFE_ONESCAN_AUTHTOKEN'};
      const intrusionRequests = apiEndpointData.findIntrusionRequestsForUsername('evanrolfe@onescan.io', intruderHeaders);
      const urls = intrusionRequests.map(intrusionRequest => intrusionRequest.url);

      intrusionRequests.forEach((intrusionRequest) => {
        expect(intrusionRequest.headers.authorization).toEqual('EVANROLFE_ONESCAN_AUTHTOKEN');
      });
      expect(urls).toMatchObject([
        'http://localhost:3001/secrets/117.json',
        'http://localhost:3001/secrets/118.json'
      ]);
    });

    it('should return intrusionRequests for evanrolfe@gmail.com', () => {
      const intruderHeaders = {'authorization': 'EVANROLFE_GMAIL_AUTHTOKEN'};
      const intrusionRequests = apiEndpointData.findIntrusionRequestsForUsername('evanrolfe@gmail.com', intruderHeaders);
      expect(intrusionRequests.length).toEqual(3);

      const urls = intrusionRequests.map(intrusionRequest => intrusionRequest.url);

      intrusionRequests.forEach((intrusionRequest) => {
        expect(intrusionRequest.headers.authorization).toEqual('EVANROLFE_GMAIL_AUTHTOKEN');
      });
      expect(urls).toMatchObject([
        'http://localhost:3001/secrets/1.json',
        'http://localhost:3001/secrets/4.json',
        'http://localhost:3001/secrets/116.json'
      ]);
    });
  });

  describe('#apiResponseCallback()', () => {
    let apiEndpointData, mockResponse;

    beforeEach(() => {
      const configArgs = {
        authorisationHeaders: ['authorization'],
        responseIsAuthorised: (response, body) => { return true; }
      }
      const config = new Config(configArgs);
      apiEndpointData = new ApiEndpointsCollection(config);

      mockResponse = {
        url() { return 'http://localhost:3001/secrets/1.json' },
        status() { return 200 },
        headers() { return { 'x-request-id': '74ef04c4-b5cf-413d-8bad-571d90ddbab2' } },
        text() { return '{}' },
        request() {
          return {
            url() { return 'http://localhost:3001/secrets/1.json' },
            headers() { return { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)' } },
            method() { return 'GET' }
          }
        },
      };
    });

    // TODO: Test when the cookies arg is not null
    describe('when there is no api-endpoint for the request', () => {
      it('should save the api-request to a new api-endpoint entry', async () => {
        apiEndpointData.apiRequestCallback(mockResponse.request(), null, 'http://localhost:3000/secrets/1', 'Public');
        await apiEndpointData.apiResponseCallback(mockResponse, null, 'http://localhost:3000/secrets/1', 'Public');

        const result = apiEndpointData.apiEndpoints[0];

        expect(result.url).toEqual('http://localhost:3001/secrets/1.json');
        expect(result.method).toEqual('GET');
        expect(result.requests.length).toEqual(1);

        expect(result.requests[0].user).toEqual('Public');
        expect(result.requests[0].pageUrl).toEqual('http://localhost:3000/secrets/1');
        expect(result.requests[0].headers).toMatchObject({ 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)' });
        expect(result.requests[0].response.status).toEqual(200);
        expect(result.requests[0].response.headers).toMatchObject({ 'x-request-id': '74ef04c4-b5cf-413d-8bad-571d90ddbab2' });
        expect(result.requests[0].response.authorised).toEqual(true);
      });
    });

    describe('when there is already an api-endpoint for the request and another requeuest entry for this user logged', () => {
      it('should save the api-request to that api-endpoint', async () => {
        apiEndpointData.apiRequestCallback(mockResponse.request(), null, 'http://localhost:3000/secrets/1', 'Public');
        apiEndpointData.apiRequestCallback(mockResponse.request(), null, 'http://localhost:3000/secrets/1/edit', 'Public');
        await apiEndpointData.apiResponseCallback(mockResponse, null, 'http://localhost:3000/secrets/1', 'Public');
        await apiEndpointData.apiResponseCallback(mockResponse, null, 'http://localhost:3000/secrets/1/edit', 'Public');

        const result = apiEndpointData.apiEndpoints[0];
        console.log(result);
        expect(result.url).toEqual('http://localhost:3001/secrets/1.json');
        expect(result.method).toEqual('GET');
        expect(result.requests.length).toEqual(2);

        expect(result.requests[0].user).toEqual('Public');
        expect(result.requests[0].pageUrl).toEqual('http://localhost:3000/secrets/1');
        expect(result.requests[1].user).toEqual('Public');
        expect(result.requests[1].pageUrl).toEqual('http://localhost:3000/secrets/1/edit');
      });
    });
  });
});
