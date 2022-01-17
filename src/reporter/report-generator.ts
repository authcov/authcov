import Ejs from 'ejs';
import * as fs from 'fs';
import ApiEndpoint from '../data/api-endpoint';
import ApiEndpointsPresenter from '../data/api-endpoints-presenter';
import PageData from '../data/page-data';

const deleteFolderRecursive = function(path: string) {
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

export default class ReportGenerator {
  apiEndpointsPresenter: ApiEndpointsPresenter;
  pageData: PageData;
  packagePath: string;
  reportPath: string;

  constructor(apiEndpoints: ApiEndpoint[], pageData: PageData, packagePath: string) {
    this.apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpoints);
    this.pageData = pageData;
    this.packagePath = packagePath;
  }

  generate(reportPath: string): void {
    this.reportPath = reportPath;

    this._clearReportDir();
    this._createReportDir();
    this._copyAssets();

    this._generateResourcePages();
    this._generateRequestPages();
    this._generatePagePages();
    this._generateIndex();
    this._generateAuthGroups();
    this._generatePagesCrawled();

    console.log(`Generated report in ${this.reportPath}`);
  }

  _clearReportDir(): void {
    deleteFolderRecursive(this.reportPath);
  }

  _createReportDir(): void {
    fs.mkdirSync(this.reportPath);
    fs.mkdirSync(`${this.reportPath}/resources`);
    fs.mkdirSync(`${this.reportPath}/pages`);
    fs.mkdirSync(`${this.reportPath}/screenshots`);
  }

  _generateResourcePages(): void {
    this.apiEndpointsPresenter.apiEndpoints.forEach((apiEndpoint) => {
      const data = {
        apiEndpoint: apiEndpoint,
        activePage: null
      };
      this._generateFile(this.packagePath + '/src/reporter/views/resource.ejs', `${this.reportPath}/resources/${apiEndpoint.id}.html`, data);
    });
  }

  _generateRequestPages(): void {
    this.apiEndpointsPresenter.apiEndpoints.forEach((apiEndpoint) => {
      const dir = `${this.reportPath}/resources/${apiEndpoint.id}`;

      if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      apiEndpoint.requests.forEach((request) => {
        const page = this.pageData.findPage(request.pageUrl, request.user);

        const data = {
          request: request,
          apiEndpoint: apiEndpoint,
          page: page,
          activePage: null
        };

        this._generateFile(this.packagePath + '/src/reporter/views/request.ejs', `${this.reportPath}/resources/${apiEndpoint.id}/${request.id}.html`, data);
      });
    });
  }

  _generatePagePages(): void {
   this.pageData.pages.forEach((page) => {
      const data = {
        page: page,
        activePage: 'pages'
      };
      this._generateFile(this.packagePath + '/src/reporter/views/page.ejs', `${this.reportPath}/pages/${page.id}.html`, data);
    });
  }

  _generateIndex(): void {
    const data = {
      apiEndpoints: this.apiEndpointsPresenter.sortedApiEndpoints(),
      usersRequested: this.apiEndpointsPresenter.usersRequested(),
      activePage: 'index'
    };
    this._generateFile(this.packagePath + '/src/reporter/views/index.ejs', `${this.reportPath}/index.html`, data);
  }

  _generateAuthGroups(): void {
    const data = {
      apiEndpointGroups: this.apiEndpointsPresenter.groupsForView(),
      usersRequested: this.apiEndpointsPresenter.usersRequested(),
      activePage: 'groups'
    };
    this._generateFile(this.packagePath + '/src/reporter/views/groups.ejs', `${this.reportPath}/groups.html`, data);
  }

  _generatePagesCrawled(): void {
    const data = {
      pages: this.pageData.pages,
      activePage: 'pages'
    };
    this._generateFile(this.packagePath + '/src/reporter/views/pages.ejs', `${this.reportPath}/pages.html`, data);
  }

  _generateFile(templatePath: string, outputPath: string, data: Record<string, any>): void {
    const template = fs.readFileSync(templatePath, 'utf8');
    const html = Ejs.render(template, data, {views:[this.packagePath + '/src/reporter/views']});

    fs.writeFileSync(outputPath, html);
  }

  _copyAssets(): void {
    fs.copyFile(this.packagePath + '/src/reporter/views/bootstrap.min.css', `${this.reportPath}/bootstrap.min.css`, (err) => {
      if (err) throw err;
    });
    fs.copyFile(this.packagePath + '/src/reporter/views/bootstrap.min.js', `${this.reportPath}/bootstrap.min.js`, (err) => {
      if (err) throw err;
    });
    fs.copyFile(this.packagePath + '/src/reporter/views/jquery-3.4.1.min.js', `${this.reportPath}/jquery-3.4.1.min.js`, (err) => {
      if (err) throw err;
    });
    fs.copyFile(this.packagePath + '/src/reporter/views/popper.min.js', `${this.reportPath}/popper.min.js`, (err) => {
      if (err) throw err;
    });
    fs.copyFile(this.packagePath + '/src/reporter/views/dashboard.css', `${this.reportPath}/dashboard.css`, (err) => {
      if (err) throw err;
    });
  }
}
