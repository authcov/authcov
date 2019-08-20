const Ejs = require('ejs');
const fs = require('fs');
const ApiEndpointsPresenter = require('../data/api-endpoints-presenter.js');

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

class ReportGenerator {
  constructor(apiEndpoints, pageData, packagePath) {
    this.apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpoints);
    this.pageData = pageData;
    this.packagePath = packagePath;
  }

  generate(reportPath) {
    this.reportPath = reportPath;
    // These two functions have already been called by UsersCrawler at the start
    //this._clearReportDir();
    //this._createReportDir();
    this._copyAssets();

    this._generateResourcePages();
    this._generateRequestPages();
    this._generatePagePages();
    this._generateIndex();
    this._generateAuthGroups();
    this._generatePagesCrawled();

    console.log(`Generated report in ${reportPath}`);
  }

  _clearReportDir() {
    deleteFolderRecursive('./report');
  }

  _createReportDir() {
    fs.mkdirSync('./report');
    fs.mkdirSync('./report/resources');
    fs.mkdirSync('./report/pages');
    fs.mkdirSync('./report/screenshots');
  }

  _generateResourcePages() {
    this.apiEndpointsPresenter.apiEndpoints.forEach((apiEndpoint) => {
      const data = {
        apiEndpoint: apiEndpoint,
        activePage: null
      };
      this._generateFile(this.packagePath + '/lib/reporter/views/resource.ejs', `${this.reportPath}/resources/${apiEndpoint.id}.html`, data);
    });
  }

  _generateRequestPages() {
    this.apiEndpointsPresenter.apiEndpoints.forEach((apiEndpoint) => {
      const dir = `./report/resources/${apiEndpoint.id}`;

      if(fs.existsSync(dir)) {
        deleteFolderRecursive(dir);
      }

      fs.mkdirSync(dir);

      apiEndpoint.requests.forEach((request) => {
        const page = this.pageData.findPage(request.pageUrl, request.user);

        const data = {
          request: request,
          apiEndpoint: apiEndpoint,
          page: page,
          activePage: null
        };
        this._generateFile(this.packagePath + '/lib/reporter/views/request.ejs', `${this.reportPath}/resources/${apiEndpoint.id}/${request.id}.html`, data);
      });
    });
  }

  _generatePagePages() {
   this.pageData.pages.forEach((page) => {
      const data = {
        page: page,
        activePage: 'pages'
      };
      this._generateFile(this.packagePath + '/lib/reporter/views/page.ejs', `${this.reportPath}/pages/${page.id}.html`, data);
    });
  }

  _generateIndex() {
    const data = {
      apiEndpoints: this.apiEndpointsPresenter.sortedApiEndpoints(),
      usersRequested: this.apiEndpointsPresenter.usersRequested(),
      activePage: 'index'
    };
    this._generateFile(this.packagePath + '/lib/reporter/views/index.ejs', `${this.reportPath}/index.html`, data);
  }

  _generateAuthGroups() {
    const data = {
      apiEndpointGroups: this.apiEndpointsPresenter.groupsForView(),
      usersRequested: this.apiEndpointsPresenter.usersRequested(),
      activePage: 'groups'
    };
    this._generateFile(this.packagePath + '/lib/reporter/views/groups.ejs', `${this.reportPath}/groups.html`, data);
  }

  _generatePagesCrawled() {
    const data = {
      pages: this.pageData.pages,
      activePage: 'pages'
    };
    this._generateFile(this.packagePath + '/lib/reporter/views/pages.ejs', `${this.reportPath}/pages.html`, data);
  }

  _generateFile(templatePath, outputPath, data) {
    const template = fs.readFileSync(templatePath, 'utf8');
    const html = Ejs.render(template, data, {views:[this.packagePath + '/lib/reporter/views']});

    fs.writeFileSync(outputPath, html, (error) => {
      if(error) {
        console.log('Error saving file!');
      }
    });
  }

  _copyAssets() {
    fs.copyFile(this.packagePath + '/lib/reporter/views/bootstrap.min.css', `${this.reportPath}/bootstrap.min.css`, (err) => {
      if (err) throw err;
    });
    fs.copyFile(this.packagePath + '/lib/reporter/views/bootstrap.min.js', `${this.reportPath}/bootstrap.min.js`, (err) => {
      if (err) throw err;
    });
    fs.copyFile(this.packagePath + '/lib/reporter/views/jquery-3.4.1.min.js', `${this.reportPath}/jquery-3.4.1.min.js`, (err) => {
      if (err) throw err;
    });
    fs.copyFile(this.packagePath + '/lib/reporter/views/popper.min.js', `${this.reportPath}/popper.min.js`, (err) => {
      if (err) throw err;
    });
    fs.copyFile(this.packagePath + '/lib/reporter/views/dashboard.css', `${this.reportPath}/dashboard.css`, (err) => {
      if (err) throw err;
    });
  }
}

module.exports = ReportGenerator;
