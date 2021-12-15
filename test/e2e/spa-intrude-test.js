const { expect } = require('chai');
const fs = require('fs');

const UsersIntruder = require('../../src/intruder/users-intruder.js');
const ApiEndpointData = require('../../src/data/api-endpoint-data.js');
const configArgs = require('./configs/spa-config.js');
const BaseConfig = require('../../src/config/base-config.js');
const { createTmpDir, compareApiEndpointsFiles } = require('../utils/compare_files.js');
const config = new BaseConfig(configArgs);

describe('Intruding SPA with cookie-based auth', () => {
  beforeEach(() => {
    createTmpDir();
  });

  it('saves apiRequests', async () => {
    fs.copyFileSync('./test/e2e/expected_output/spa_crawl_api_endpoints.json', './tmp/api_endpoints.json', fs.constants.COPYFILE_FICLONE, (err) => {
      if (err) throw err;
    });

    const apiEndpointData = new ApiEndpointData({config: config});
    apiEndpointData.loadFile('./tmp/api_endpoints.json');
    const usersIntruder = new UsersIntruder(config, apiEndpointData);

    await usersIntruder.start();
    apiEndpointData.saveToFile('./tmp/api_endpoints.json');
    compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/spa_intrude_api_endpoints.json');
  });
});
