const IntruderCredentialsGrabber = require('../intruder/intruder-credentials-grabber.js')

async function testLogin(configPath) {
  const config = require(configPath);
  const credsGrabber = await IntruderCredentialsGrabber.init(config);

  let authHeaders = await credsGrabber.getAuthHeaders(config.options.crawlUser.username, config.options.crawlUser.password);

  console.log(`Testing the login to ${configPath}`)
  console.log(authHeaders);
  await credsGrabber.disconnect();
  return;
}

module.exports = testLogin;
