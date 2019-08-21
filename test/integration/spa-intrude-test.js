const { expect } = require('chai');
const fs = require('fs');

const UsersIntruder = require('../../lib/intruder/users-intruder.js');
const ApiEndpointData = require('../../lib/data/api-endpoint-data.js');
const configArgs = require('./configs/spa-config.js');
const BaseConfig = require('../../lib/config/base-config.js');
const CompareFiles = require('../utils/compare_files.js');
const config = new BaseConfig(configArgs);

describe('Intruding SPA with cookie-based auth', () => {
  describe('./tmp/api_endpoints.json', () => {
    it('should save apiRequests', async () => {
      fs.copyFileSync('./test/integration/expected_output/spa_crawl_api_endpoints.json', './tmp/api_endpoints.json', (err) => {
        if (err) throw err;
      });

      const apiEndpointData = new ApiEndpointData({config: config});
      apiEndpointData.loadFile('./tmp/api_endpoints.json');
      const usersIntruder = new UsersIntruder(config, apiEndpointData);

      await usersIntruder.start();
      apiEndpointData.saveToFile('./tmp/api_endpoints.json');
      CompareFiles.compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/integration/expected_output/spa_intrude_api_endpoints.json');
    });
  });
});
