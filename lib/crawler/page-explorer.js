
class PageExplorer {
  constructor(page, pageUrl, currentUser, config, pageData) {
    this.page = page;

    // TODO: sometimes pageUrl != page.url() for example www.example.com vs www.example.com/
    this.pageUrl = pageUrl;
    this.currentUser = currentUser;
    this.config = config;
    this.pageData = pageData;
    this.buttonsClicked = [];
  }

  // TODO: Make this click buttons recursively until max depth reached or there are no more buttons to click
  async getLinks() {
    let links = await this._scrapeLinks();

    if(this.config.options.clickButtons !== true) {
      return links;
    }

    // TODO: Move these function definitions outside of getLinks()
    await this.page.exposeFunction('doNotClickButton', async (outerHTML) => {
      if(this.buttonsClicked.includes(outerHTML)) {
        return true;
      }
      const ignoreButton = this.config.ignoreButton(outerHTML);

      if(ignoreButton === true) {
        this.pageData.buttonIgnoredCallback(this.pageUrl, outerHTML, this.currentUser);
      }

      return ignoreButton;
    });

    await this.page.exposeFunction('buttonClicked', (outerHTML) => {
      this.pageData.buttonClickedCallback(this.pageUrl, outerHTML, this.currentUser);
      this.buttonsClicked.push(outerHTML);
    });

    await this.page.$$eval(this.config.options.buttonXPath, this._pageClickButtons);

    // TODO: DO we need this waitFor here?
    await this.page.waitFor(200);

    const newLinks = await this._scrapeLinks();

    links = links.concat(newLinks);
    const uniqueLinks = [...new Set(links)];

    return uniqueLinks;
  }

  async _scrapeLinks() {
    return this.page.$$eval('a', links => links.map(link => link.href));
  }

  // Page functions only gets executed inside the browser window context
  async _pageClickButtons(buttons) {
    for(let i = 0; i < buttons.length; i++) {
      let button = buttons[i];
      const doNotClick = await doNotClickButton(button.outerHTML);

      if(doNotClick===false) {
        await button.click();
        buttonClicked(button.outerHTML);
      }
    }
  }

    //await this.page.screenshot({ path: './tmp/screenshot.png', fullPage: true });
}

module.exports = PageExplorer;
