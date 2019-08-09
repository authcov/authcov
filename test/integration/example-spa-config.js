const options = {
  "users": [
    {"username": 'alice@authcov.io', "password": 'password'}
  ],
  "intruders": [
    {"username": 'Public', "password": null},
    {"username": 'bob@authcov.io', "password": 'password'}
  ],
  "authorisationHeaders": ['cookie'],
  "baseUrl": 'http://localhost',
  "saveResponses": false,
  "saveScreenshots": true,
  "clickButtons": true,
  "buttonXPath": 'button',
  "type": 'spa',
  "authenticationType": 'cookie', // cookie or token
  "maxDepth": 3,
  "xhrTimeout": 5,  // Wait max 5 seconds for XHR requests to complet,
  "pageTimeout": 30
};

const loginFunction = async function(tab, username, password){
  console.log(`Logging in as ${username}...`);
  await tab.goto('http://localhost/login');
  await tab.waitForSelector('input[name=email]');
  await tab.waitForSelector('input[name=password]');
  await tab.waitFor(1000);

  await tab.type('input[name=email]', username);
  await tab.type('input[name=password]', password);

  await tab.tap('#login-button')
  await tab.waitFor(1000);

  return;
}

const responseIsAuthorised = function(status, headers, body) {
  return (status != 401);
};

const ignoreApiRequest = function(url, method) {
  if(url.includes('http://localhost/sockjs-node')){
    return true;
  }

  return false;
}

const ignoreButton = function(outerHTML) {
  if(outerHTML.includes('submit') || outerHTML.includes('Save')) {
    return true;
  }

  return false;
}

module.exports = {
  options: options,
  loginFunction: loginFunction,
  responseIsAuthorised: responseIsAuthorised,
  ignoreApiRequest: ignoreApiRequest,
  ignoreButton: ignoreButton
};
