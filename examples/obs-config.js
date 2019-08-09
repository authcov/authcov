class Config {
  constructor() {
    this.users = [
      {username: 'Admin', password: 'opensuse'}
    ];
    this.intruders = [
      {username: 'Public', password: null}
    ];
    this.authorisationHeaders = ['cookie'];
    this.baseUrl = 'http://localhost:3000';
    this.saveResponses = true;
    this.saveScreenshots = true;
    this.clickButtons = false;
    this.buttonXPath = 'button';
    this.type = 'mpa';  // mpa or spa
    this.authenticationType = 'cookie'; // cookie or token
    this.maxDepth = 1;
    this.maxConcurrency = 10;
    this.verboseOutput = false;
    this.xhrTimeout = 5;  // Wait max 5 seconds for XHR requests to complete
    this.pageTimeout = 30;
  }

  async loginFunction(tab, username, password){
    console.log(`Logging in as ${username}...`);

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
  }

  responseIsAuthorised(response, responseBody) {
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
  }

  ignoreLink(url) {
    if(url === null) {
      return true;
    }

    if(!url.includes(this.baseUrl)){
      return true;
    }

    if(url.includes('/session/destroy')) { // || url.includes('/image_templates')
      return true;
    }

    return false;
  }

  ignoreApiRequest(url, method) {
    if(url.includes('http://localhost:8000/sockjs-node')){
      return true;
    }

    return false;
  }

  ignoreButton(outerHTML) {
    if(outerHTML.includes('Logout') || outerHTML.includes('submit') || outerHTML.includes('Save')) {
      return true;
    }

    return false;
  }
}

module.exports = Config;
