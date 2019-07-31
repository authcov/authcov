const UsersIntruder = require('../lib/crawler/users-intruder.js');
const ResultsParser = require('../lib/crawler/results-parser.js');
const FilesConfig = require('../lib/crawler/web-apps/files-config.js');
const Crawler = require('../lib/crawler/crawler.js');

const webAppConfig = new FilesConfig();
const resultsParser = new ResultsParser({webAppConfig: webAppConfig});
resultsParser.loadFile('./tmp/api_requests.json');

const intruderHeaders = {
  'cookie': '_ga=GA1.2.1250592245.1563522702; _gid=GA1.2.751511344.1563522702; _gat_gtag_UA_141845413_1=1; kxp={%22key%22:%22od1z6supwf%22%2C%22part1%22:%22e01f3c66af07f20f4d5c%22}',
  'x-brickapi-auth': 'e01f3c66af07f20f4d5c6a7d304c8c3f28196785'
}
const usersIntruder = new UsersIntruder(webAppConfig, resultsParser);

(async () => {
  usersIntruder.intrudeAsUser('info@onescan.io', intruderHeaders);
})();

