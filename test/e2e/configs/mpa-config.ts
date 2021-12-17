export const config = {
  "crawlUser": {"username": 'alice@authcov.io', "password": 'password'},
  "intruders": [
    {"username": "Public", "password": null},
    {"username": "bob@authcov.io", "password": "password"}
  ],
  "authorisationHeaders": ['cookie'],
  "baseUrl": 'http://localhost:3001',
  "saveResponses": false,
  "saveScreenshots": false,
  "clickButtons": false,
  "buttonXPath": 'button',
  "type": 'mpa',  // mpa or spa
  "authenticationType": 'cookie', // cookie or token
  "maxDepth": 2,
  "xhrTimeout": 5,  // Wait max 5 seconds for XHR requests to complete
  "pageTimeout": 30,
  "verboseOutput": false,
  "apiEndpointsFile": "./tmp/api_endpoints.json",
  "pagesFile": "./tmp/pages.json",
  "reportPath": "./tmp/report",
  "headless": true,
  "loginConfig": {
    "url": "http://localhost:3001/users/sign_in",
    "usernameXpath": "input[type=email]",
    "passwordXpath": "input[type=password]",
    "submitXpath": "input[type=submit]"
  },
  "ignoreLinksIncluding": ["/users/sign_out"],
  "ignoreAPIrequestsIncluding": ["/sockjs-node"],
  "ignoreButtonsIncluding": ["Logout", "submit", "Save"],
  "responseIsAuthorised": function(status, headers, body) {
    // If its redirecting to the login page
    if(status == 302 && headers.location.includes('/users/sign_in')) {
      return false;
    }

    if(status == 401) {
      return false;
    }

    return true;
  }
};
