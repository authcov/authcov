const { expect } = require('chai');
const fs = require('fs');

const UsersCrawler = require('../../lib/crawler/users-crawler.js'); // TODO: Sort out these requires
const ApiEndpointData = require('../../lib/data/api-endpoint-data.js');
const PageData = require('../../lib/data/page-data.js');
const ExampleConfig = require('../../lib/scripts/web-apps/example-config.js');

async function crawlUsers() {
  const webAppConfig = new ExampleConfig();
  const apiEndpointData = new ApiEndpointData({webAppConfig: webAppConfig});
  const pageData = new PageData({webAppConfig: webAppConfig});

  const usersCrawler = new UsersCrawler(webAppConfig, apiEndpointData, pageData);
  await usersCrawler.start();
}

function compareApiEndpointsFiles(actualFile, expectedFile) {
  const apiEndpointsActualJSON = fs.readFileSync(actualFile, {encoding: 'utf8'});
  const apiEndpointsActual = JSON.parse(apiEndpointsActualJSON);

  const apiEndpointsExpectedJSON = fs.readFileSync(expectedFile, {encoding: 'utf8'});
  const apiEndpointsExpected = JSON.parse(apiEndpointsExpectedJSON);

  apiEndpointsActual.forEach((apiEndpointActual) => {
    const apiEndpointExpected = apiEndpointsExpected.find((apiEndpoint) => {
      return (apiEndpoint.url == apiEndpointActual.url && apiEndpoint.method == apiEndpointActual.method);
    });

    if(apiEndpointExpected === undefined) {
      throw `Could not find apiEndpointExpected for request: ${apiEndpointActual.method} ${apiEndpointActual.url}`;
    }

    if(apiEndpointActual.requests.length != apiEndpointExpected.requests.length) {
      throw `Unequal request length: ${apiEndpointActual.method} ${apiEndpointActual.url}`;
    }

    expect(apiEndpointActual.requests.length).to.equal(apiEndpointExpected.requests.length);

    for(let i = 0; i < apiEndpointExpected.requests.length; i++) {
      const actualRequest = apiEndpointActual.requests[i];
      const expectedRequest = apiEndpointExpected.requests[i];

      expect(actualRequest.user).to.equal(expectedRequest.user);
      expect(actualRequest.pageUrl).to.equal(expectedRequest.pageUrl);
      expect(actualRequest.response.status).to.eql(expectedRequest.response.status);
      expect(actualRequest.response.authorised).to.eql(expectedRequest.response.authorised);
    }
  });
}

// TODO: Make this tell you which apirequest is failing if it fails
describe('UsersCrawler', () => {
  describe('./tmp/api_endpoints.json', () => {
    it('should save apiRequests for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
      await crawlUsers();
      compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/integration/expected_output/api_endpoints_expected.json');
    });
  });
});
