import * as fs from 'fs';

import UsersIntruder from '../../src/intruder/users-intruder';
import ApiEndpointData from '../../src/data/api-endpoint-data';
import { config as configArgs } from './configs/spa-config';
import Config from '../../src/config/config';
import { createTmpDir, compareApiEndpointsFiles } from '../utils/compare_files';
const config = new Config(configArgs);

describe('Intruding SPA with cookie-based auth', () => {
  beforeEach(() => {
    createTmpDir();
  });

  it('saves apiRequests', async () => {
    fs.copyFileSync('./test/e2e/expected_output/spa_crawl_api_endpoints.json', './tmp/api_endpoints.json', fs.constants.COPYFILE_FICLONE);

    const apiEndpointData = new ApiEndpointData({config: config});
    apiEndpointData.loadFile('./tmp/api_endpoints.json');
    const usersIntruder = new UsersIntruder(config, apiEndpointData);

    await usersIntruder.start();
    apiEndpointData.saveToFile('./tmp/api_endpoints.json');
    compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/spa_intrude_api_endpoints.json');
  });
});
