const { expect } = require('chai');

const UsersCrawler = require('../../dist/crawler/users-crawler.js');
const ApiEndpointData = require('../../dist/data/api-endpoint-data.js');
const PageData = require('../../dist/data/page-data.js');
const configArgs = require('./configs/spa-config.js');
const BaseConfig = require('../../dist/config/base-config.js');
const { createTmpDir, compareApiEndpointsFiles, comparePagesFiles } = require('../utils/compare_files.js');
const ApiEndpointsPresenter = require('../../dist/data/api-endpoints-presenter.js');
const ReportGenerator = require('../../dist/reporter/report-generator.js');

describe('UsersCrawler for SPA with cookie-based auth', () => {
  beforeEach(() => {
    createTmpDir();
  });

  it('should stop waiting for API requests that take longer than the timeout limit', async () => {
    // Deep clone the config and set clickButtons to true
    const configButtonClick = Object.assign({}, configArgs);
    configButtonClick.crawlUser = {username: 'Public', password: null};
    configButtonClick.baseUrl = 'http://localhost/really_slow';
    configButtonClick.maxDepth = 0;
    const config = new BaseConfig(configButtonClick);

    const apiEndpointData = new ApiEndpointData({config: config});
    const pageData = new PageData({config: config});
    const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
    const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
    const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);

    await usersCrawler.start();
    compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/spa_timeout_api_endpoints.json');
    comparePagesFiles('./tmp/pages.json', './test/e2e/expected_output/spa_timeout_pages.json');
  });
});

