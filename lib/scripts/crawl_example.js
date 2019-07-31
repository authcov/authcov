const UsersCrawler = require('../crawler/users-crawler.js');
const ApiEndpointData = require('../data/api-endpoint-data.js');
const PageData = require('../data/page-data.js');
const ExampleConfig = require('./web-apps/example-config.js');

const webAppConfig = new ExampleConfig();
const apiEndpointData = new ApiEndpointData({webAppConfig: webAppConfig});
const pageData = new PageData({webAppConfig: webAppConfig});
const usersCrawler = new UsersCrawler(webAppConfig, apiEndpointData, pageData);

// google-chrome --remote-debugging-port=9222 --disable-web-security --user-data-dir=/home/evan/.chrome --headless
(async () => {
  await usersCrawler.start();
  apiEndpointData.saveToFile('./tmp/api_endpoints.json');
  pageData.saveToFile('./tmp/pages.json');
  console.log('Done.');
})();
