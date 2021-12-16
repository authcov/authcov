const { expect } = require('chai');

const UsersCrawler = require('../../dist/crawler/users-crawler.js');
const ApiEndpointData = require('../../dist/data/api-endpoint-data.js');
const PageData = require('../../dist/data/page-data.js');
const configArgs = require('./configs/spa-config.js');
const BaseConfig = require('../../dist/config/base-config.js');
const { createTmpDir, compareApiEndpointsFiles, comparePagesFiles } = require('../utils/compare_files.js');
const ApiEndpointsPresenter = require('../../dist/data/api-endpoints-presenter.js');
const ReportGenerator = require('../../dist/reporter/report-generator.js');

const config = new BaseConfig(configArgs);
const apiEndpointData = new ApiEndpointData({config: config});
const pageData = new PageData({config: config});
const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);

describe('UsersCrawler for SPA with cookie-based auth', () => {
  beforeEach(() => {
    createTmpDir();
  });

  it('saves apiRequests and pages for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
    await usersCrawler.start();
    compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/spa_crawl_api_endpoints.json');
    comparePagesFiles('./tmp/pages.json', './test/e2e/expected_output/spa_crawl_pages.json');
  });
});
