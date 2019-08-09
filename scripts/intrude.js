const UsersIntruder = require('../lib/intruder/users-intruder.js');
const ApiEndpointData = require('../lib/data/api-endpoint-data.js');

// TODO: Make require paths from root dir
// https://gist.github.com/branneman/8048520
const configFilePath = process.argv[2];
const Config = require(configFilePath);

const config = new Config();
const apiEndpointData = new ApiEndpointData({config: config});
apiEndpointData.loadFile('./tmp/api_endpoints.json');

const usersIntruder = new UsersIntruder(config, apiEndpointData);

(async () => {
  usersIntruder.start();
})();
