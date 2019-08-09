const ReportGenerator = require('../lib/reporter/report-generator.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');
const ApiEndpointsPresenter = require('../lib/data/api-endpoints-presenter.js');
const PageData = require('../lib/data/page-data.js');

const configFilePath = process.argv[2];
const Config = require(configFilePath);
const config = new Config();

const apiEndpointData = new ApiEndpointData({config: config});
const pageData = new PageData({config: config});
apiEndpointData.loadFile('./tmp/api_endpoints.json');
pageData.loadFile('./tmp/pages.json');

const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
reporter.generate('./tmp/report');

console.log('Done');
