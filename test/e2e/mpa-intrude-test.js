const { expect } = require('chai');
const fs = require('fs');

const UsersIntruder = require('../../lib/intruder/users-intruder.js');
const ApiEndpointData = require('../../lib/data/api-endpoint-data.js');
const configArgs = require('./configs/mpa-config.js');
const BaseConfig = require('../../lib/config/base-config.js');
const CompareFiles = require('../utils/compare_files.js');

const config = new BaseConfig(configArgs);

// TODO: Make this tell you which apirequest is failing if it fails
describe('UsersCrawler for MPA with cookie-based auth', () => {
  describe('./tmp/api_endpoints.json', () => {
    it('should save apiRequests for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
      fs.copyFileSync('./test/e2e/expected_output/mpa_crawl_api_endpoints.json', './tmp/api_endpoints.json', (err) => {
        if (err) throw err;
      });

      const apiEndpointData = new ApiEndpointData({config: config});
      apiEndpointData.loadFile('./tmp/api_endpoints.json');
      const usersIntruder = new UsersIntruder(config, apiEndpointData);

      await usersIntruder.start();
      apiEndpointData.saveToFile('./tmp/api_endpoints.json');
      CompareFiles.compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/mpa_intrude_api_endpoints.json');
    });
  });
});
