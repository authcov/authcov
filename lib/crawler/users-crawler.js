const Crawler = require('./crawler.js');

class UsersCrawler {
  constructor(webAppConfig, apiEndpointData, pageData) {
    this.webAppConfig = webAppConfig;
    this.apiEndpointData = apiEndpointData;
    this.pageData = pageData;
  }

  async start() {
    for(let i = 0; i < this.webAppConfig.users.length; i++) {
      let user = this.webAppConfig.users[i];

      if(user.username == 'Public') {
        await this.crawlUser();
      } else {
        await this.crawlUser(user.username, user.password);
      }
    }
    return;
  }

  async crawlUser(username, password) {
    const maxConcurrency = (this.webAppConfig.maxConcurrency === undefined) ? 10 : this.webAppConfig.maxConcurrency;

    const crawler = await Crawler.init({
      apiEndpointData: this.apiEndpointData,
      pageData: this.pageData,
      webAppConfig: this.webAppConfig,
      maxConcurrency: maxConcurrency
    });

    if(username != undefined && password != undefined) {
      await crawler.login(username, password);
    }
    await crawler.startCrawling();
    await crawler.onIdle();
    await crawler.close();
    return;
  }
}

module.exports = UsersCrawler;
