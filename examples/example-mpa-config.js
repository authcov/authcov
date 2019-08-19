const config = {
  "crawlUser": {"username": 'alice@authcov.io', "password": 'password'},
  "intruders": [
    {"username": 'bob@authcov.io', "password": 'password'},
    {"username": 'Public', "password": null}
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
  "verboseOutput": false,
  "apiEndpointsFile": "./tmp/api_endpoints.json",
  "pagesFile": "./tmp/pages.json",
  "reportPath": "./tmp/report",
  "headless": true,
  "unAuthorizedStatusCodes": [302, 401],

  "loginFunction": async function(tab, username, password){
    await tab.goto('http://localhost:3001/users/sign_in');
    await tab.waitForSelector('input[type=email]');
    await tab.waitForSelector('input[type=password]');

    await tab.type('input[type=email]', username);
    await tab.type('input[type=password]', password);

    await tab.tap('input[type=submit]');
    await tab.waitFor(500);

    return;
  },

  "responseIsAuthorised": function(status, headers, body) {
    // If its redirecting to the login page
    if(status == 302 && headers.location.includes('/users/sign_in')) {
      return false;
    }

    if(status == 401) {
      return false;
    }

    return true;
  },

  "ignoreLink": function(url) {
    if(url.includes('/users/sign_out')) {
      return true;
    }

    return false;
  },
  "ignoreApiRequest": function(url, method) {
    if(url.includes('http://localhost:3001/sockjs-node')){
      return true;
    }

    return false;
  },
  "ignoreButton": function(outerHTML) {
    if(outerHTML.includes('Logout') || outerHTML.includes('submit') || outerHTML.includes('Save')) {
      return true;
    }

    return false;
  }
};

module.exports = config;
