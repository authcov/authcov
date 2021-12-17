export const config = {
  "crawlUser": {"username": 'alice@authcov.io', "password": 'password'},
  "intruders": [
    {"username": 'Public', "password": null},
    {"username": 'bob@authcov.io', "password": 'password'}
  ],
  "authorisationHeaders": ['cookie'],
  "baseUrl": 'http://localhost',
  "saveResponses": false,
  "saveScreenshots": false,
  "clickButtons": false,
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
  "unAuthorizedStatusCodes": [401],
  "ignoreLinksIncluding": ["/slow", "/really_slow"],
  "ignoreAPIrequestsIncluding": ["/sockjs-node"],
  "ignoreButtonsIncluding": ["submit", "Save"],
  "loginConfig": {
    "url": "http://localhost/login",
    "usernameXpath": "input[name=email]",
    "passwordXpath": "input[name=password]",
    "submitXpath": "#login-button"
  }
};
