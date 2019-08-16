const options = {
  "crawlUser": {username: 'Admin', password: 'opensuse'},
  "intruders": [
    {username: 'Public', password: null}
  ],
  "authorisationHeaders": ['cookie'],
  "baseUrl": 'http://localhost:3000',
  "saveResponses": true,
  "saveScreenshots": true,
  "clickButtons": false,
  "buttonXPath": 'button',
  "type": 'mpa',  // mpa or spa
  "authenticationType": 'cookie', // cookie or token
  "maxDepth": 2,
  "maxConcurrency": 10,
  "verboseOutput": false,
  "xhrTimeout": 5,  // Wait max 5 seconds for XHR requests to complete
  "pageTimeout": 30,
  "apiEndpointsFile": "./tmp/api_endpoints.json",
  "pagesFile": "./tmp/pages.json",
  "reportPath": "./tmp/report",
  "headless": true,
  "loginFunction": async function(tab, username, password){
    await tab.goto('http://localhost:3000');

    await tab.waitForSelector('#login-trigger');
    await tab.tap('#login-trigger');

    await tab.waitForSelector('input[name=username]');
    await tab.waitForSelector('input[name=password]');

    await tab.type('input[name=username]', username);
    await tab.type('input[name=password]', password);

    await tab.tap('input[type=submit]');
    await tab.waitFor(500);

    return;
  },
  "responseIsAuthorised": function(response, responseBody) {
    let response_status;

    try {
      response_status = response.status();
    } catch(error) {
      response_status = response.status;
    }

    if([401, 403, 404, 400].includes(response_status)) {
      return false;
    }

    return true;
  },
  "ignoreLink": function(url) {
    if(url === null) {
      return true;
    }

    if(!url.includes(this.options.baseUrl)){
      return true;
    }

    if(url.includes('/session/destroy')) { // || url.includes('/image_templates')
      return true;
    }

    return false;
  },
  "ignoreApiRequest": function(url, method) {
    if(url.includes('http://localhost:8000/sockjs-node')){
      return true;
    }

    return false;
  }
};

const ignoreButton = function(outerHTML) {
  if(outerHTML.includes('Logout') || outerHTML.includes('submit') || outerHTML.includes('Save')) {
    return true;
  }

  return false;
};

module.exports = {
  options: options,
  ignoreButton: ignoreButton
};

