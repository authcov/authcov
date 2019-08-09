const options = {
  "crawlUser": {"username": "<USER1>", "password": "<PASSWORD>"},
  "intruders": [
    {"username": "Public", "password": null},
    {"username": "<USER2>", "password": "<PASSWORD>"}
  ],
  "authorisationHeaders": ['cookie'],
  "baseUrl": '<BASEURL>',
  "type": 'mpa',  // mpa or spa
  "authenticationType": 'cookie', // cookie or token
  "maxDepth": 2,

  // Extras:
  "verboseOutput": false,
  "saveResponses": true,
  "saveScreenshots": true,
  "clickButtons": true,
  "buttonXPath": 'button',
  "xhrTimeout": 5,
  "pageTimeout": 30,
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
