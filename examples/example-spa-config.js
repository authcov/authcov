const config = {
  "crawlUser": {"username": 'alice@authcov.io', "password": 'password'},
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
  "pageTimeout": 30,
  "apiEndpointsFile": "./tmp/api_endpoints.json",
  "pagesFile": "./tmp/pages.json",
  "reportPath": "./tmp/report",
  "verboseOutput": false,
  "headless": true,
  "ignoreLinksIncluding": ["/slow", "/really_slow"],
  "unAuthorizedStatusCodes": [401],
  "ignoreAPIrequestsIncluding": ["/sockjs-node"],
  "ignoreButtonsIncluding": ["submit", "Save"],

  "loginFunction": async function(tab, username, password){
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
};

module.exports = config;
