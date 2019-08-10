const options = {
  "crawlUser": {"username": 'alice@authcov.io', "password": 'password'},
  "intruders": [
    {"username": "Public", "password": null},
    {"username": "bob@authcov.io", "password": "password"}
  ],
  "authorisationHeaders": ['cookie'],
  "baseUrl": 'http://localhost:3001',
  "saveResponses": false,
  "saveScreenshots": true,
  "clickButtons": true,
  "buttonXPath": 'button',
  "type": 'mpa',  // mpa or spa
  "authenticationType": 'cookie', // cookie or token
  "maxDepth": 2,
  "xhrTimeout": 5,  // Wait max 5 seconds for XHR requests to complete
  "pageTimeout": 30,
  "verboseOutput": false,
  "apiEndpointsFile": "./tmp/api_endpoints.json",
  "pagesFile": "./tmp/pages.json",
  "reportPath": "./tmp/report"
};

const loginFunction = async function(tab, username, password){
  await tab.goto('http://localhost:3001/users/sign_in');
  await tab.waitForSelector('input[type=email]');
  await tab.waitForSelector('input[type=password]');

  await tab.type('input[type=email]', username);
  await tab.type('input[type=password]', password);

  await tab.tap('input[type=submit]');
  await tab.waitFor(500);

  return;
};

const responseIsAuthorised = function(status, headers, body) {
  // If its redirecting to the login page
  if(status == 302 && headers.location.includes('/users/sign_in')) {
    return false;
  }

  if(status == 401) {
    return false;
  }

  return true;
};

const ignoreLink = function(url) {
  if(url.includes('/users/sign_out')) {
    return true;
  }

  return false;
};

const ignoreApiRequest = function(url, method) {
  if(url.includes('http://localhost:3001/sockjs-node')){
    return true;
  }

  return false;
};

const ignoreButton = function(outerHTML) {
  if(outerHTML.includes('Logout') || outerHTML.includes('submit') || outerHTML.includes('Save')) {
    return true;
  }

  return false;
};

module.exports = {
  options: options,
  loginFunction: loginFunction,
  responseIsAuthorised: responseIsAuthorised,
  ignoreApiRequest: ignoreApiRequest,
  ignoreButton: ignoreButton,
  ignoreLink: ignoreLink
};
