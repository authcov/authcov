class Config {
  constructor() {
    this.users = [
      {username: 'alice@authcov.io', password: 'password'}
    ];
    this.intruders = [
      {username: 'Public', password: null},
      {username: 'bob@authcov.io', password: 'password'}
    ];
    this.baseUrl = 'http://localhost:3000';
    this.saveResponses = false;
    this.buttonXPath = 'button';
    this.type = 'spa';

    this.authenticationType = 'token'; // cookie or token
    this.authorisationHeaders = ['authorization'];
    this.tokenTriggeringPage = 'http://localhost:3000/secrets';
    this.xhrTimeout = 5;
    this.pageTimeout = 30;
    this.verboseOutput = false;
  }

  async loginFunction(tab, username, password){
    await tab.goto('http://localhost:3000/');
    await tab.waitFor(1000);
    await tab.tap('#login-link')

    await tab.waitForSelector('input[name=password]');
    await tab.waitFor(1000);

    await tab.type('input[name=email]', username);
    await tab.type('input[name=password]', password);

    await tab.tap('.auth0-lock-submit')

    await tab.waitFor(1000);
    console.log('Done.');

     return;
  }

  responseIsAuthorised(response) {
    return (response.status() != 401);
  }

  ignoreApiRequest(url, method) {
    if(url.includes('http://localhost:3000/sockjs-node')){
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

  //TODO: Add authorised checking function here
}

module.exports = Config;

