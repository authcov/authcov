import * as fs from 'fs';

import UsersIntruder from '../../src/intruder/users-intruder';
import ApiEndpointsCollection from '../../src/data/api-endpoints-collection';
import { config as configArgs } from './configs/mpa-config';
import Config from '../../src/config/config';
import { createTmpDir, compareApiEndpointsFiles } from '../utils/compare_files';

const config = new Config(configArgs);

// TODO: Make this tell you which apirequest is failing if it fails
describe('UsersCrawler for MPA with cookie-based auth', () => {
  beforeEach(() => {
    createTmpDir();
  });

  it('saves apiRequests for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
    fs.copyFileSync('./test/e2e/expected_output/mpa_crawl_api_endpoints.json', './tmp/api_endpoints.json', fs.constants.COPYFILE_FICLONE);

    const apiEndpointData = new ApiEndpointsCollection(config);
    apiEndpointData.loadFile('./tmp/api_endpoints.json');
    const usersIntruder = new UsersIntruder(config, apiEndpointData);

    await usersIntruder.start();
    apiEndpointData.saveToFile('./tmp/api_endpoints.json');
    compareApiEndpointsFiles(
      './tmp/api_endpoints.json',
      './test/e2e/expected_output/mpa_intrude_api_endpoints.json'
    );
  });
});
