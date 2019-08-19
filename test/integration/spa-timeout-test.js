const { expect } = require('chai');

const UsersCrawler = require('../../lib/crawler/users-crawler.js');
const ApiEndpointData = require('../../lib/data/api-endpoint-data.js');
const PageData = require('../../lib/data/page-data.js');
const configArgs = require('./configs/spa-config.js');
const BaseConfig = require('../../lib/config/base-config.js');
const CompareFiles = require('../utils/compare_files.js');
const ApiEndpointsPresenter = require('../../lib/data/api-endpoints-presenter.js');
const ReportGenerator = require('../../lib/reporter/report-generator.js');

describe('UsersCrawler for SPA with cookie-based auth', () => {
  describe('./tmp/api_endpoints.json', () => {
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
      CompareFiles.compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/integration/expected_output/spa_timeout_api_endpoints.json');
      CompareFiles.comparePagesFiles('./tmp/pages.json', './test/integration/expected_output/spa_timeout_pages.json');
    });
  });
});

