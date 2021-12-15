const { expect } = require('chai');

const UsersCrawler = require('../../src/crawler/users-crawler.js');
const ApiEndpointData = require('../../src/data/api-endpoint-data.js');
const PageData = require('../../src/data/page-data.js');
const configArgs = require('./configs/spa-config.js');
const BaseConfig = require('../../src/config/base-config.js');
const { createTmpDir, compareApiEndpointsFiles, comparePagesFiles } = require('../utils/compare_files.js');
const ApiEndpointsPresenter = require('../../src/data/api-endpoints-presenter.js');
const ReportGenerator = require('../../src/reporter/report-generator.js');

// Deep clone the config and set clickButtons to true
const configButtonClick = Object.assign({}, configArgs);
configButtonClick.clickButtons = true;
configButtonClick.maxDepth = 0;
configButtonClick.crawlUser = {username: 'Public', password: null};
const config = new BaseConfig(configButtonClick);

const apiEndpointData = new ApiEndpointData({config: config});
const pageData = new PageData({config: config});
const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);

describe('UsersCrawler for SPA with cookie-based auth and button clicking enabled', () => {
  beforeEach(() => {
    createTmpDir();
  });

  it('saves apiRequests and pages for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
    await usersCrawler.start();
    compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/spa_button_click_api_endpoints.json');
    comparePagesFiles('./tmp/pages.json', './test/e2e/expected_output/spa_button_click_pages.json');
  });
});

