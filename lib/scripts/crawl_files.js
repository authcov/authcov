const UsersCrawler = require('../crawler/users-crawler.js');
const ResultsParser = require('../crawler/results-parser.js');
const FilesConfig = require('../crawler/web-apps/files-config.js');
const Crawler = require('../crawler/crawler.js');

const webAppConfig = new FilesConfig();
const resultsParser = new ResultsParser({webAppConfig: webAppConfig});
const usersCrawler = new UsersCrawler(webAppConfig, resultsParser);

(async () => {
/*
  const crawler = await Crawler.init({
    resultsParser: resultsParser,
    webAppConfig: webAppConfig
  });

  const user = webAppConfig.users[0];
  await crawler.login(user.username, user.password);
*/
  await usersCrawler.start();
  resultsParser.saveToFile('./tmp/api_requests.json');
  console.log('Done.');
})();
