const { expect } = require('chai');
const fs = require('fs');

const UsersIntruder = require('../../lib/intruder/users-intruder.js');
const ApiEndpointData = require('../../lib/data/api-endpoint-data.js');
const config = require('./configs/example-spa-config.js');
const CompareFiles = require('../utils/compare_files.js');

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
      CompareFiles.compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/integration/expected_output/spa_intrude_api_endpoints.json');
    });
  });
});
