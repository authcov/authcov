const IntruderCredentialsGrabber = require('../lib/intruder/intruder-credentials-grabber.js')
const Config = require('./example-mpa-config.js');

const webAppConfig = new Config();

(async () => {
  const credsGrabber = await IntruderCredentialsGrabber.init(webAppConfig);

  let authHeaders = await credsGrabber.getAuthHeaders('bob@authcov.io', 'password');
  console.log(authHeaders);
  authHeaders = await credsGrabber.getAuthHeaders('alice@authcov.io', 'password');
  console.log(authHeaders);

  await credsGrabber.disconnect();

  console.log('ok');
})();
