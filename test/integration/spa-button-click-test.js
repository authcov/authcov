const { expect } = require('chai');

const UsersCrawler = require('../../lib/crawler/users-crawler.js');
const ApiEndpointData = require('../../lib/data/api-endpoint-data.js');
const PageData = require('../../lib/data/page-data.js');
const config = require('./configs/spa-config.js');
const CompareFiles = require('../utils/compare_files.js');

// Deep clone the config and set clickButtons to true
const configButtonClick = Object.assign({}, config);
configButtonClick.options = Object.assign({}, configButtonClick.options);
configButtonClick.options.clickButtons = true;
configButtonClick.options.maxDepth = 0;

const apiEndpointData = new ApiEndpointData({config: configButtonClick});
const pageData = new PageData({config: configButtonClick});
const usersCrawler = new UsersCrawler(configButtonClick, apiEndpointData, pageData);

describe('UsersCrawler for SPA with cookie-based auth', () => {
  describe('./tmp/api_endpoints.json', () => {
    it('should save apiRequests for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
      await usersCrawler.start();
      CompareFiles.compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/integration/expected_output/spa_button_click_api_endpoints.json');
      CompareFiles.comparePagesFiles('./tmp/pages.json', './test/integration/expected_output/spa_button_click_pages.json');
    });
  });
});

