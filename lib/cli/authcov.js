const program = require('commander');
const generateConfig = require('../config/generator.js')

program
  .version('0.0.1')
  .option('-v, --version', 'The version number of installed AuthCov')

program
  .command('new <configFileName> <webAppUrl>')
  .description('Generate a default config to scan <webAppUrl>\n\nExample: authcov new siteconfig.js http://mywebapp.com')
  .action((configFileName, webAppUrl) => {
    generateConfig(configFileName, webAppUrl);
  });

program
  .command('crawl <configFileName>')
  .description('Generate a default config to scan <webAppUrl>\n\nExample: authcov new siteconfig.js http://mywebapp.com')
  .action((configFileName, webAppUrl) => {
    generateConfig(configFileName, webAppUrl);
  });

program.parse(process.argv);
