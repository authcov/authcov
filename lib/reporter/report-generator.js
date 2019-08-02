const Ejs = require('ejs');
const fs = require('fs');

class ReportGenerator {
  constructor(apiEndpointData, pageData) {
    this.apiEndpointData = apiEndpointData;
    this.pageData = pageData;
  }

  generateIndex() {
    console.log(`Found ${this.apiEndpointData.apiEndpoints.length} api endpoints!`);
    console.log(`Found ${this.pageData.pages.length} pages!`);

    const data = {
      apiEndpoints: this.apiEndpointData.apiEndpoints
    };
    this._generateFile('./lib/reporter/templates/index.ejs', './tmp/index.html', data);
  }

  _generateFile(templatePath, outputPath, data) {
    const template = fs.readFileSync(templatePath, 'utf8');
    const html = Ejs.render(template, data);

    fs.writeFile(outputPath, html, (error) => {
      if(error) {
        console.log('Error saving file!');
      }
    });

    this._copyAssets();
  }

  _copyAssets() {
    fs.copyFile('./lib/reporter/templates/bootstrap.min.css', './tmp/bootstrap.min.css', (err) => {
      if (err) throw err;
    });
    fs.copyFile('./lib/reporter/templates/bootstrap.min.js', './tmp/bootstrap.min.js', (err) => {
      if (err) throw err;
    });
    fs.copyFile('./lib/reporter/templates/jquery-3.4.1.min.js', './tmp/jquery-3.4.1.min.js', (err) => {
      if (err) throw err;
    });
  }
}

module.exports = ReportGenerator;
