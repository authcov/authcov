const program = require('commander');
const generateConfig = require('../config/generator.js')

program
  .version('0.0.1')
  .option('-v, --version', 'The version number of installed AuthCov')
  .option('-d, --debug', 'Get verbose output')

program
  .command('new <configFileName> <webAppUrl>')
  .description('generate a default config to scan <webAppUrl>')
  .action((configFileName, webAppUrl) => {
    generateConfig(configFileName, webAppUrl);
  });

program.parse(process.argv);
