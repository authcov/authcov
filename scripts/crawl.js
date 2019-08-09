const UsersCrawler = require('../lib/crawler/users-crawler.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');
const PageData = require('../lib/data/page-data.js');

// TODO: Make require paths from root dir
// https://gist.github.com/branneman/8048520
const configFilePath = process.argv[2];
const config = require(configFilePath);

const apiEndpointData = new ApiEndpointData({config: config});
const pageData = new PageData({config: config});
const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData);

// google-chrome --remote-debugging-port=9222 --disable-web-security --user-data-dir=/home/evan/.chrome --headless
(async () => {
  await usersCrawler.start();
  console.log('Done.');
  apiEndpointData.saveToFile('./tmp/api_endpoints.json');
})();
