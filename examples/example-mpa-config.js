const options = {
  "users": [
    {"username": 'alice@authcov.io', "password": 'password'}
  ],
  "intruders": [
    {"username": 'Public', "password": null},
    {"username": 'bob@authcov.io', "password": 'password'}
  ],
  "authorisationHeaders": ['cookie'],
  "baseUrl": "http://localhost:3001",
  "saveResponses": true,
  "saveScreenshots": true,
  "clickButtons": true,
  "buttonXPath": 'button',
  "type": 'mpa',
  "authenticationType": 'cookie', // cookie or token
  "maxDepth": 3,
  "xhrTimeout": 5,
  "pageTimeout": 30,
  "verboseOutput": true
};

const loginFunction = async function(tab, username, password){
  console.log(`Logging in as ${username}...`);
  await tab.goto('http://localhost:3001/users/sign_in');
  await tab.waitForSelector('input[type=email]');
  await tab.waitForSelector('input[type=password]');

  await tab.type('input[type=email]', username);
  await tab.type('input[type=password]', password);

  await tab.tap('input[type=submit]');
  await tab.waitFor(500);

  return;
};

const responseIsAuthorised = function(response, responseBody) {
  let response_status;
  let response_headers;

  try {
    response_status = response.status();
    response_headers = response.headers();
  } catch(error) {
    response_status = response.status;
    response_headers = response.headers;
  }

  // If its redirecting to the login page
  if(response_status == 302 && response_headers.location.includes('/users/sign_in')) {
    return false;
  }

  if(response_status == 401) {
    return false;
  }

  return true;
};

const ignoreLink = function(url) {
  if(url.includes('/users/sign_out')) {
    console.log(`Ignoring link: ${url}`);
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
