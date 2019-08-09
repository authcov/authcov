const Crawler = require('../lib/crawler/crawler.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');
const PageData = require('../lib/data/page-data.js');
const Config = require('../examples/obs-config.js');

const config = new Config();
const apiEndpointData = new ApiEndpointData({config: config});
const pageData = new PageData({config: config});


// google-chrome --remote-debugging-port=9222 --disable-web-security --user-data-dir=/home/evan/.chrome --headless
(async () => {
  const crawler = await Crawler.init({
    apiEndpointData: apiEndpointData,
    pageData: pageData,
    config: config,
    maxConcurrency: 10
  });

  await crawler.login(config.users[0].username, config.users[0].password);
  await crawler.close();
  return;
})();
