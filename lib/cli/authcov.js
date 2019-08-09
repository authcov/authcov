const cli = require('commander');
const path = require('path');

const generateConfig = require('../config/generator.js');
const crawl = require('./crawl.js');
const intrude = require('./intrude.js');
const testLogin = require('./test-login.js');

cli
  .version('0.0.1')
  .option('-v, --version', 'The version number of installed AuthCov')

cli
  .command('new <configFileName> <webAppUrl>')
  .description('Generate a config file to scan <webAppUrl>.\n\nExample: authcov new myconfig.js http://mywebapp.com')
  .action((configFileName, webAppUrl) => {
    generateConfig(configFileName, webAppUrl);
  });

cli
  .command('crawl <configFileName>')
  .description('Crawl a web app while logged in as the crawlUser defined in the config.\n\nExample: authcov crawl myconfig.js')
  .action((configFileName) => {
    const configPath = path.join(process.cwd(), configFileName);
    crawl(configPath);
  });

cli
  .command('intrude <configFileName>')
  .description('Attempt intrusion requests on the resources discovered while crawling.\n\nExample: authcov intrude myconfig.js')
  .action((configFileName) => {
    const configPath = path.join(process.cwd(), configFileName);
    intrude(configPath);
  });

cli
  .command('test-login <configFileName>')
  .description('Test that your loginFunction works correctly and that the intruder can grab the authorisation headers for a user. Recommend running this against a head-FULL browser (not headless).\n\nExample: authcov test-login myconfig.js')
  .action((configFileName) => {
    const configPath = path.join(process.cwd(), configFileName);
    testLogin(configPath);
  });

cli.parse(process.argv);
