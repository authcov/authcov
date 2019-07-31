const UsersCrawler = require('../lib/crawler/users-crawler.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');
const PageData = require('../lib/data/page-data.js');
const ExampleConfig = require('./example-config.js');

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
