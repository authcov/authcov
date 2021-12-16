import * as fs from 'fs';

export default class PageData {
  config: any;
  pages: any[];

  constructor(options) {
    if(typeof(options.config) == 'object') {
      this.config = options.config;
    }

    this.pages = [];
  }

  loadFile(filePath) {
    let rawJson = fs.readFileSync(filePath).toString();
    this.pages = JSON.parse(rawJson);
  }

  saveToFile(fileName) {
    this.pages = this.pages.sort(function(a, b){
      if(a.pageUrl < b.pageUrl) { return -1; }
      if(a.pageUrl > b.pageUrl) { return 1; }
      return 0;
    });

    fs.writeFileSync(fileName, JSON.stringify(this.pages, null, 2));
  }

  pageCrawledCallback(pageUrl, id, currentUser) {
    const createdAt = new Date();

    this.pages.push({
      id: id,
      pageUrl: pageUrl,
      user: currentUser,
      createdAt: createdAt,
      dialogsOpened: [],
      buttonsClicked: [],
      buttonsIgnored: []
    });

    this.saveToFile('./pages.json');
  }

  buttonIgnoredCallback(pageUrl, buttonHTML, currentUser) {
    const page = this.findPage(pageUrl, currentUser);

    //console.log(`Button ignored: ${pageUrl}, ${buttonHTML}`);
    page.buttonsIgnored.push(buttonHTML);
    this.saveToFile('./pages.json');
  }

  buttonClickedCallback(pageUrl, buttonHTML, currentUser) {
    const page = this.findPage(pageUrl, currentUser);

    page.buttonsClicked.push(buttonHTML);
    console.log(`Button clicked: ${buttonHTML} on ${pageUrl} as ${currentUser}`)
    this.saveToFile('./pages.json');
  }

  dialogCallback(pageUrl, currentUser, dialog) {
    const page = this.findPage(pageUrl, currentUser);

    console.log(`Handled dialog at ${pageUrl}: ${dialog.message()}`);
    page.dialogsOpened.push({
      message: dialog.message(),
      type: dialog.type()
    });
    this.saveToFile('./pages.json');
  }

  findPage(pageUrl, user) {
    return this.pages.find((page) => {
      return (page.pageUrl == pageUrl && page.user == user);
    });
  }
}
