class AirtableConfig {
  constructor() {
    this.users = [
      {username: 'evanrolfe@onescan.io', password: 'Password1'},
      {username: 'info@onescan.io', password: 'Password1'},
    ];
    this.authorisationHeaders = ['cookie'];
    this.baseUrl = 'https://staging.airtable.com';
    this.saveResponses = false;
  }

  async loginFunction(tab, username, password){
    console.log(`Logging in as ${username}...`);
    await tab.goto('https://staging.airtable.com/login');

    await tab.waitForSelector('input[name=email]');
    await tab.waitForSelector('input[name=password]');

    await tab.type('input[name=email]', username);
    await tab.type('input[name=password]', password);

    await tab.tap('input[type=submit')
    await tab.waitFor(2000);

    return;
  }

  ignoreApiRequest(url, method) {
    if(!url.includes(this.baseUrl) || url == 'https://staging.airtable.com/internal/beacon'){
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
}

module.exports = AirtableConfig;
