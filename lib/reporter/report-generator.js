const Ejs = require('ejs');
const fs = require('fs');

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
  constructor(apiEndpointsPresenter, pageData) {
    this.apiEndpointsPresenter = apiEndpointsPresenter;
    this.pageData = pageData;
  }

  generate(reportPath) {
    this.reportPath = reportPath;
    this._clearReportDir();
    this._createReportDir();
    this._generateResourcePages();
    this._generateRequestPages();
    this._generateIndex();
    this._generateAuthGroups();
    this._generatePagesCrawled();
  }

  _clearReportDir() {
    deleteFolderRecursive('./tmp/report');
  }

  _createReportDir() {
    fs.mkdirSync('./tmp/report');
    fs.mkdirSync('./tmp/report/resources');
  }

  _generateResourcePages() {
    this.apiEndpointsPresenter.apiEndpoints.forEach((apiEndpoint) => {
      const data = {
        apiEndpoint: apiEndpoint,
        activePage: null
      };
      this._generateFile('./lib/reporter/views/resource.ejs', `${this.reportPath}/resources/${apiEndpoint.id}.html`, data);
    });
  }

  _generateRequestPages() {
    this.apiEndpointsPresenter.apiEndpoints.forEach((apiEndpoint) => {
      const dir = `./tmp/report/resources/${apiEndpoint.id}`;
      fs.mkdirSync(dir);

      apiEndpoint.requests.forEach((request) => {
        const data = {
          request: request,
          apiEndpoint: apiEndpoint,
          activePage: null
        };
        this._generateFile('./lib/reporter/views/request.ejs', `${this.reportPath}/resources/${apiEndpoint.id}/${request.id}.html`, data);
      });
    });
  }

  _generateIndex() {
    const data = {
      apiEndpoints: this.apiEndpointsPresenter.sortedApiEndpoints(),
      usersRequested: this.apiEndpointsPresenter.usersRequested(),
      activePage: 'index'
    };
    this._generateFile('./lib/reporter/views/index.ejs', `${this.reportPath}/index.html`, data);
  }

  _generateAuthGroups() {
    const data = {
      apiEndpointGroups: this.apiEndpointsPresenter.groupsForView(),
      usersRequested: this.apiEndpointsPresenter.usersRequested(),
      activePage: 'groups'
    };
    this._generateFile('./lib/reporter/views/groups.ejs', `${this.reportPath}/groups.html`, data);
  }

  _generatePagesCrawled() {
    const data = {
      apiEndpoints: this.apiEndpointsPresenter.sortedApiEndpoints(),
      usersRequested: this.apiEndpointsPresenter.usersRequested(),
      activePage: 'pages'
    };
    this._generateFile('./lib/reporter/views/pages.ejs', `${this.reportPath}/pages.html`, data);
  }

  _generateFile(templatePath, outputPath, data) {
    const template = fs.readFileSync(templatePath, 'utf8');
    const html = Ejs.render(template, data, {views:['./lib/reporter/views']});

    fs.writeFile(outputPath, html, (error) => {
      if(error) {
        console.log('Error saving file!');
      }
    });

    this._copyAssets();
  }

  _copyAssets() {
    fs.copyFile('./lib/reporter/views/bootstrap.min.css', `${this.reportPath}/bootstrap.min.css`, (err) => {
      if (err) throw err;
    });
    fs.copyFile('./lib/reporter/views/bootstrap.min.js', `${this.reportPath}/bootstrap.min.js`, (err) => {
      if (err) throw err;
    });
    fs.copyFile('./lib/reporter/views/jquery-3.4.1.min.js', `${this.reportPath}/jquery-3.4.1.min.js`, (err) => {
      if (err) throw err;
    });
    fs.copyFile('./lib/reporter/views/dashboard.css', `${this.reportPath}/dashboard.css`, (err) => {
      if (err) throw err;
    });
  }
}

module.exports = ReportGenerator;
