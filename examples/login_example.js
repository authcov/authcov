const Crawler = require('../lib/crawler/crawler.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');
const PageData = require('../lib/data/page-data.js');
const ExampleMpaConfig = require('./example-mpa-config.js');

const webAppConfig = new ExampleMpaConfig();
const apiEndpointData = new ApiEndpointData({webAppConfig: webAppConfig});
const pageData = new PageData({webAppConfig: webAppConfig});


// google-chrome --remote-debugging-port=9222 --disable-web-security --user-data-dir=/home/evan/.chrome --headless
(async () => {
  const crawler = await Crawler.init({
    apiEndpointData: apiEndpointData,
    pageData: pageData,
    webAppConfig: webAppConfig,
    maxConcurrency: 10
  });

  await crawler.login(webAppConfig.users[1].username, webAppConfig.users[1].password);
  await crawler.close();
  return;
})();
