const config = {
  "crawlUser": {"username": 'admin', "password": 'adminpassword'},
  "intruders": [
    {username: 'contributor', password: 'contributorspassword'},
    {username: 'Public', password: null}
  ],
  "baseUrl": 'http://localhost:8000',
  "saveResponses": true,
  "saveScreenshots": true,
  "clickButtons": false,
  "type": 'mpa',
  "authenticationType": 'cookie',
  "authorisationHeaders": ['cookie'],
  // For example, in wordpress the admin cookie is restricted to the path: /wp-admin
  "cookiesTriggeringPage": 'http://localhost:8000/wp-admin/index.php',
  "maxDepth": 2,
  "xhrTimeout": 5,
  "pageTimeout": 30,
  "verboseOutput": false,
  "headless": true,
  "loginConfig": {
    "url": "http://localhost:8000/wp-login.php",
    "usernameXpath": "#user_login",
    "passwordXpath": "#user_pass",
    "submitXpath": "input[type=submit]"
  },
  "responseIsAuthorised": function(status, headers, body) {
    // If its redirecting to the login page
    if(status == 302 && headers.location.includes('wp-login.php')) {
      return false;
    }

    if([400, 401, 403, 404, 500].includes(status)) {
      return false;
    }

    return true;
  },
  "ignoreLink": function(url) {
    if(!url.includes(this.baseUrl) || url.includes('wp-login.php')){
      return true;
    }

    return false;
  }
};

module.exports = config;
