const { expect } = require('chai');

const UsersCrawler = require('../../lib/crawler/users-crawler.js');
const ApiEndpointData = require('../../lib/data/api-endpoint-data.js');
const PageData = require('../../lib/data/page-data.js');
const config = require('./example-spa-config.js');
const CompareFiles = require('../utils/compare_files.js');

const apiEndpointData = new ApiEndpointData({config: config});
const pageData = new PageData({config: config});
const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData);

describe('UsersCrawler for SPA with cookie-based auth', () => {
  describe('./tmp/api_endpoints.json', () => {
    it('should save apiRequests for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
      await usersCrawler.start();
      CompareFiles.compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/integration/expected_output/spa_cookie_api_endpoints.json');
      CompareFiles.comparePagesFiles('./tmp/pages.json', './test/integration/expected_output/spa_cookie_pages.json');
    });
  });
});
