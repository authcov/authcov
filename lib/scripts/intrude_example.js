const UsersIntruder = require('../intruder/users-intruder.js');
const ApiEndpointData = require('../data/api-endpoint-data.js');
const ExampleConfig = require('./web-apps/example-config.js');

const webAppConfig = new ExampleConfig();
const apiEndpointData = new ApiEndpointData({webAppConfig: webAppConfig});
apiEndpointData.loadFile('./tmp/api_endpoints.json');

const usersIntruder = new UsersIntruder(webAppConfig, apiEndpointData);

(async () => {
  usersIntruder.start();
})();
