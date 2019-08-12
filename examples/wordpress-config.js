const options = {
  "crawlUser": {"username": 'evan', "password": 'fdsklj34'},
  "intruders": [
    {username: 'contributer', password: 'contributorspassword'},
    {username: 'Public', password: null}
  ],
  "authorisationHeaders": ['cookie'],
  "baseUrl": 'http://localhost:8000',
  "saveResponses": true,
  "saveScreenshots": true,
  "clickButtons": false,
  "buttonXPath": 'button',
  "type": 'mpa',  // mpa or spa
  "authenticationType": 'cookie', // cookie or token
  "maxDepth": 1,
  "xhrTimeout": 5,
  "pageTimeout": 30,
  "apiEndpointsFile": "./tmp/api_endpoints.json",
  "pagesFile": "./tmp/pages.json",
  "reportPath": "./tmp/report",
  "verboseOutput": false
};

const loginFunction = async function(tab, username, password){
  await tab.goto('http://localhost:8000/wp-login.php');
  await tab.waitForSelector('#user_login');
  await tab.waitForSelector('#user_pass');

  await tab.type('#user_login', username);
  await tab.type('#user_pass', password);

  await tab.tap('input[type=submit]');
  await tab.waitFor(500);

  return;
}

const responseIsAuthorised = function(status, headers, body) {
  // If its redirecting to the login page
  if(status == 302 && headers.location.includes('wp-login.php')) {
    return false;
  }

  if([401, 403, 400].includes(status)) {
    return false;
  }

  return true;
}

const ignoreLink = function(url) {
  if(url === null) {
    return true;
  }

  if(!url.includes(this.options.baseUrl)){
    return true;
  }

  if(url.includes('wp-login.php')) {
    return true;
  }

  return false;
}

const ignoreApiRequest = function(url, method) {
  if(url.includes('http://localhost:8000/sockjs-node')){
    return true;
  }

  return false;
}

const ignoreButton = function(outerHTML) {
  if(outerHTML.includes('Logout') || outerHTML.includes('submit') || outerHTML.includes('Save')) {
    return true;
  }

  return false;
}

module.exports = {
  options: options,
  loginFunction: loginFunction,
  responseIsAuthorised: responseIsAuthorised,
  ignoreApiRequest: ignoreApiRequest,
  ignoreButton: ignoreButton,
  ignoreLink: ignoreLink
};
