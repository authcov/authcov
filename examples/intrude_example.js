const UsersIntruder = require('../lib/intruder/users-intruder.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');
const ExampleConfig = require('./example-config.js');

const webAppConfig = new ExampleConfig();
const apiEndpointData = new ApiEndpointData({webAppConfig: webAppConfig});
apiEndpointData.loadFile('./tmp/api_endpoints.json');

const usersIntruder = new UsersIntruder(webAppConfig, apiEndpointData);

(async () => {
  usersIntruder.start();
})();
