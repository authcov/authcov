import UsersCrawler from '../../src/crawler/users-crawler';
import ApiEndpointsCollection from '../../src/data/api-endpoints-collection';
import PageData from '../../src/data/page-data';
import { config as configArgs } from './configs/mpa-config';
import Config from '../../src/config/config';
import { createTmpDir, compareApiEndpointsFiles, comparePagesFiles } from '../utils/compare_files';
import ApiEndpointsPresenter from '../../src/data/api-endpoints-presenter';
import ReportGenerator from '../../src/reporter/report-generator';

const config = new Config(configArgs);
const apiEndpointData = new ApiEndpointsCollection(config);
const pageData = new PageData({config: config});
const reporter = new ReportGenerator(apiEndpointData.apiEndpoints, pageData, '.');

const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);

describe('UsersCrawler for MPA with cookie-based auth', () => {
  beforeEach(() => {
    createTmpDir();
  });

  it('saves apiRequests and pages for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
    await usersCrawler.start();

    compareApiEndpointsFiles(
      './tmp/api_endpoints.json',
      './test/e2e/expected_output/mpa_crawl_api_endpoints.json'
    );
    comparePagesFiles('./tmp/pages.json', './test/e2e/expected_output/mpa_crawl_pages.json');
  });
});
