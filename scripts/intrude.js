const UsersIntruder = require('../lib/intruder/users-intruder.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');

// TODO: Make require paths from root dir
// https://gist.github.com/branneman/8048520
const configFilePath = process.argv[2];
const Config = require(configFilePath);

const webAppConfig = new Config();
const apiEndpointData = new ApiEndpointData({webAppConfig: webAppConfig});
apiEndpointData.loadFile('./tmp/api_endpoints.json');

const usersIntruder = new UsersIntruder(webAppConfig, apiEndpointData);

(async () => {
  usersIntruder.start();
})();
