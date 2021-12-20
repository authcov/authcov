import { Command } from 'commander';
import * as path from 'path';
import { fileURLToPath } from 'url'

import { generateConfig } from '../config/generator';
import { crawl } from './crawl';
import { intrude } from './intrude';
import { testLogin } from './test-login';

const __dirname = path.resolve();
const __filename = fileURLToPath(import.meta.url);

const packagePath = path.resolve(__filename + '../../../../');

const parseBoolean = (value) => {
  return (value === 'true');
}

const parseCommaSeparatedList = (value, dummyPrevious) => {
  return value.split(',');
}

const cli = new Command();

cli.version('1.1.4')

cli
  .command('new <configFileName>')
  .description('Generate a config file for the site you want to scan.\nExample: authcov new myconfig.js\n')
  .action((configFileName) => {
    const configTemplatePath = path.join(packagePath, '/src/config/config-template.ts');
    generateConfig(configFileName, configTemplatePath);
  });

cli
  .command('crawl <configFileName>')
  .description('Crawl a web app while logged in as the crawlUser defined in the config.\nOptions passed in from the CLI will override whats defined in the config.\n\nExample: authcov crawl myconfig.js\n')
  .option('--authorisation-headers <value>', '(comma seperated list) the headers which are used for authorisation by the server', parseCommaSeparatedList)
  .option('--base-url <value>', 'the URL from which to start crawling')
  .option('--type <value>', 'can either be "mpa" or "spa" (multi/single page application) (without quotes)')
  .option('--authentication-type <value>', 'Can either be "cookies" or "token" (without quotes)')
  .option('--max-depth <integer>', ' how deep to crawl', parseInt)
  .option('--verbose-output <boolean>', '(true/false)', parseBoolean)
  .option('--save-responses <boolean>', '(true/false) save the API response bodies', parseBoolean)
  .option('--save-screenshots <boolean>', '(true/false) save screenshots of each page crawled', parseBoolean)
  .option('--click-buttons <boolean>', '(true/false) experimental option to click buttons on each page crawled and intercept any API requests', parseBoolean)
  .option('--button-x-path <value>', 'the xpath to determine what buttons are clicked')
  .option('--xhr-timeout <integer>', 'seconds to wait for XHR requests to complete', parseInt)
  .option('--page-timeout <integer>', 'seconds to wait for page requests to complete', parseInt)
  .option('--headless <boolean>', '(true/false) to run chrome in normal/headful browser mode, set this to false', parseBoolean)
  .option('--browser-url <value>', 'if you wish to use an existing chrome instance, set the url i.e. http://localhost:9222')
  .action((configFileName, options) => {
    const configPath = path.join(process.cwd(), configFileName);
    crawl(configPath, packagePath, options);
  });

cli
  .command('intrude <configFileName>')
  .description('Attempt intrusion requests on the resources discovered while crawling.\nExample: authcov intrude myconfig.js\n')
  .option('--authorisation-headers <value>', '(comma seperated list) the headers which are used for authorisation by the server', parseCommaSeparatedList)
  .option('--base-url <value>', 'the URL from which to start crawling')
  .option('--type <value>', 'can either be "mpa" or "spa" (multi/single page application) (without quotes)')
  .option('--authentication-type <value>', 'Can either be "cookies" or "token" (without quotes)')
  .option('--verbose-output <boolean>', '(true/false)', parseBoolean)
  .option('--save-responses <boolean>', '(true/false) save the API response bodies', parseBoolean)
  .option('--xhr-timeout <integer>', 'seconds to wait for XHR requests to complete', parseInt)
  .option('--page-timeout <integer>', 'seconds to wait for page requests to complete', parseInt)
  .option('--headless <boolean>', '(true/false) to run chrome in normal/headful browser mode, set this to false', parseBoolean)
  .option('--cookies-triggering-page <value>', 'optional - the intruder will browse to this url and then extract cookies - can be useful if cookies have the path field set on them')
  .option('--token-triggering-page <value>', 'optional - the intruder will browse to this url and then sniff the token headers sent in API requests. Can be useful if the baseUrl does not make any API requests')
  .option('--browser-url <value>', 'if you wish to use an existing chrome instance, set the url i.e. http://localhost:9222')
  .action((configFileName, options) => {
    const configPath = path.join(process.cwd(), configFileName);
    intrude(configPath, packagePath, options);
  });

cli
  .command('test-login <configFileName>')
  .description('Test that your loginFunction works correctly and that the intruder can grab the authorisation headers for a user. Recommend running this against a head-FULL browser (not headless).\nExample: authcov test-login myconfig.js\n')
  .option('--authorisation-headers <value>', '(comma seperated list) the headers which are used for authorisation by the server', parseCommaSeparatedList)
  .option('--base-url <value>', 'the URL from which to start crawling')
  .option('--type <value>', 'can either be "mpa" or "spa" (multi/single page application) (without quotes)')
  .option('--authentication-type <value>', 'Can either be "cookies" or "token" (without quotes)')
  .option('--verbose-output <boolean>', '(true/false)', parseBoolean)
  .option('--save-responses <boolean>', '(true/false) save the API response bodies', parseBoolean)
  .option('--xhr-timeout <integer>', 'seconds to wait for XHR requests to complete', parseInt)
  .option('--page-timeout <integer>', 'seconds to wait for page requests to complete', parseInt)
  .option('--headless <boolean>', '(true/false) to run chrome in normal/headful browser mode, set this to false', parseBoolean)
  .option('--cookies-triggering-page <value>', 'optional - the intruder will browse to this url and then extract cookies - can be useful if cookies have the path field set on them')
  .option('--token-triggering-page <value>', 'optional - the intruder will browse to this url and then sniff the token headers sent in API requests. Can be useful if the baseUrl does not make any API requests')
  .option('--browser-url <value>', 'if you wish to use an existing chrome instance, set the url i.e. http://localhost:9222')
  .action((configFileName, options) => {
    const configPath = path.join(process.cwd(), configFileName);
    testLogin(configPath, options);
  });

cli.parse(process.argv);
