class Config {
  constructor() {
    this.users = [
      {username: 'alice@authcov.io', password: 'password'}
    ];
    this.intruders = [
      {username: 'Public', password: null},
      {username: 'bob@authcov.io', password: 'password'}
    ];
    this.authorisationHeaders = ['cookie'];
    this.baseUrl = 'http://localhost';
    this.saveResponses = true;
    this.saveScreenshots = true;
    this.clickButtons = true;
    this.buttonXPath = 'button';
    this.type = 'spa';
    this.authenticationType = 'cookie'; // cookie or token
    this.maxDepth = 3;
    this.xhrTimeout = 5;
    this.pageTimeout = 30;
    this.verboseOutput = true;
  }

  async loginFunction(tab, username, password){
    console.log(`Logging in as ${username}...`);
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

  responseIsAuthorised(response) {
    try {
      return (response.status() != 401);
    } catch(error) { // A hack, because this is run on both crawling  & report generation
      return (response.status != 401);
    }
  }

  ignoreApiRequest(url, method) {
    if(url.includes('http://localhost/sockjs-node')){
      return true;
    }

    return false;
  }

  ignoreButton(outerHTML) {
    if(outerHTML.includes('submit') || outerHTML.includes('Save')) {
      return true;
    }

    return false;
  }
}

module.exports = Config;
