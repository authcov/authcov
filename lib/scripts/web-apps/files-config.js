class FilesConfig {
  constructor() {
    this.users = [
      {username: 'evanrolfe@onescan.io', password: 'Password1'},
      //{username: 'info@onescan.io', password: 'Password1'},
    ];
    this.authorisationHeaders = ['cookie'];
    this.baseUrl = 'https://bugbountyevan.files.com';
    this.saveResponses = false;
    this.buttonXPath = 'button';
  }

  async loginFunction(tab, username, password){
    console.log(`Logging in as ${username}...`);
    await tab.goto('https://bugbountyevan.files.com/login');

    await tab.waitForSelector('input[name=username]');
    await tab.waitForSelector('input[name=password]');

    await tab.type('input[name=username]', username);
    await tab.type('input[name=password]', password);

    await tab.tap('button[type=submit]')
    await tab.waitFor(2000);

    return;
  }

  ignoreApiRequest(url, method) {
    if(!url.includes(this.baseUrl)){
      return true;
    }

    return false;
  }

  ignoreLink(url) {
    if(url === null) {
      return true;
    }

    if(!url.includes(this.baseUrl)){
      return true;
    }

    return false;
  }

  ignoreButton(outerHTML) {
    if(outerHTML.includes('submit')) {
      return true;
    }

    return false;
  }
}

module.exports = FilesConfig;
