const Crawler = require('./crawler.js');

class UsersCrawler {
  constructor(config, apiEndpointData, pageData) {
    this.config = config;
    this.apiEndpointData = apiEndpointData;
    this.pageData = pageData;
  }

  async start() {
    for(let i = 0; i < this.config.options.users.length; i++) {
      let user = this.config.options.users[i];

      if(user.username == 'Public') {
        await this.crawlUser();
      } else {
        await this.crawlUser(user.username, user.password);
      }
    }
    return;
  }

  async crawlUser(username, password) {
    const maxConcurrency = (this.config.options.maxConcurrency === undefined) ? 10 : this.config.options.maxConcurrency;

    const crawler = await Crawler.init({
      apiEndpointData: this.apiEndpointData,
      pageData: this.pageData,
      config: this.config,
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
