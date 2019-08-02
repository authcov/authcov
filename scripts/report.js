const ReportGenerator = require('../lib/reporter/report-generator.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');
const PageData = require('../lib/data/page-data.js');

const configFilePath = process.argv[2];
const Config = require(configFilePath);
const webAppConfig = new Config();

const apiEndpointData = new ApiEndpointData({webAppConfig: webAppConfig});
const pageData = new PageData({webAppConfig: webAppConfig});
apiEndpointData.loadFile('./tmp/api_endpoints.json');
pageData.loadFile('./tmp/pages.json');

const reporter = new ReportGenerator(apiEndpointData, pageData);

reporter.generateIndex();
console.log('Done');
