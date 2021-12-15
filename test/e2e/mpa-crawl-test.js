const { expect } = require('chai');

const UsersCrawler = require('../../lib/crawler/users-crawler.js');
const ApiEndpointData = require('../../lib/data/api-endpoint-data.js');
const PageData = require('../../lib/data/page-data.js');
const configArgs = require('./configs/mpa-config.js');
const BaseConfig = require('../../lib/config/base-config.js');
const CompareFiles = require('../utils/compare_files.js');
const ApiEndpointsPresenter = require('../../lib/data/api-endpoints-presenter.js');
const ReportGenerator = require('../../lib/reporter/report-generator.js');

const config = new BaseConfig(configArgs);
const apiEndpointData = new ApiEndpointData({config: config});
const pageData = new PageData({config: config});
const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);

const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);

describe('UsersCrawler for MPA with cookie-based auth', () => {
  describe('./tmp/api_endpoints.json', () => {
    it('should save apiRequests for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
      await usersCrawler.start();
      CompareFiles.compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/mpa_crawl_api_endpoints.json');
      CompareFiles.comparePagesFiles('./tmp/pages.json', './test/e2e/expected_output/mpa_crawl_pages.json');
    });
  });
});
