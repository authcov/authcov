const UsersCrawler = require('../lib/crawler/users-crawler.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');
const PageData = require('../lib/data/page-data.js');

// TODO: Make require paths from root dir
// https://gist.github.com/branneman/8048520
const configFilePath = process.argv[2];
const Config = require(configFilePath);

const webAppConfig = new Config();
const apiEndpointData = new ApiEndpointData({webAppConfig: webAppConfig});
const pageData = new PageData({webAppConfig: webAppConfig});
const usersCrawler = new UsersCrawler(webAppConfig, apiEndpointData, pageData);

// google-chrome --remote-debugging-port=9222 --disable-web-security --user-data-dir=/home/evan/.chrome --headless
(async () => {
  await usersCrawler.start();
  console.log('Done.');
})();
