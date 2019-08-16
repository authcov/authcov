const chalk = require('chalk');

class ConfigValidator {
  constructor(config) {
    this.config = config;
    this.errors = {};
  }

  valid() {
    this._validate();

    return (this.errorKeys().length == 0)
  }

  errorKeys() {
    return Object.keys(this.errors);
  }

  errorMessage() {
    if(this.valid()) {
      return;
    }

    let message_lines = [chalk.red.bold('Configuration Error(s):')];
    this.errorKeys().forEach((key) => {
      message_lines.push(chalk.bold(`${key}:`));

      this.errors[key].forEach((message) => {
        message_lines.push(`\t${message}`);
      })
    });

    return message_lines.join("\n");
  }

  _validate() {
    this.errors = {};
    this._validateCrawlUser();
    this._validateIntruders();
    this._validateAuthorisationHeaders();
    this._validateBaseUrl();
    this._validateSaveResponses();
    this._validateSaveScreenshots();
    this._validateClickButtons();
    this._validateButtonXPath();
    this._validateType();
    this._validateAuthenticationType();
    this._validateMaxDepth();
    this._validateXhrTimeout();
    this._validatePageTimeout();
    this._validateApiEndpointsFile();
    this._validatePagesFile();
    this._validateReportPath();
    this._validateVerboseOutput();
    this._validateCookiesTriggeringPage();
    this._validateTokenTriggeringPage();
  }

  _validateCrawlUser() {
    const crawlUser = this.config.options.crawlUser;

    if(crawlUser === undefined) {
      this._addErrorMessage('options.crawlUser', 'must be defined');
      return;
    }

    if(typeof(crawlUser) !== 'object') {
      this._addErrorMessage('options.crawlUser', 'must be an object');
      return;
    }

    if(typeof(crawlUser.username) !== 'string' || typeof(crawlUser.password) !== 'string') {
      this._addErrorMessage('options.crawlUser', 'must have fields username and password defined as strings');
      return;
    }
  }

  _validateIntruders() {
    const intruders = this.config.options.intruders;

    if(intruders === undefined) {
      this._addErrorMessage('options.intruders', 'must be defined');
      return;
    }

    if(typeof(intruders) === 'array') {
      this._addErrorMessage('options.intruders', 'must be an array of user objects');
      return;
    }

    intruders.forEach((intruder) => {
      if(typeof(intruder) !== 'object') {
        this._addErrorMessage('options.intruders[]', 'must be an object');
        return;
      }

      if(typeof(intruder.username) !== 'string') {
        this._addErrorMessage('options.intruders[]', 'must have fields username and password defined as strings (unless its a public user)');
        return;
      }
    });
  }

  _validateAuthorisationHeaders() {
    const authorisationHeaders = this.config.options.authorisationHeaders;

    if(authorisationHeaders !== undefined) {
      if(typeof(authorisationHeaders) === 'array') {
        this._addErrorMessage('options.authorisationHeaders', 'must be an array of strings');
        return;
      }
    }
  }

  _validateBaseUrl() {
    const baseUrl = this.config.options.baseUrl;

    if(baseUrl === undefined) {
      this._addErrorMessage('options.baseUrl', 'must be defined');
      return;
    }
  }

  _validateSaveResponses() {
    const saveResponses = this.config.options.saveResponses;

    if(saveResponses === undefined) {
      this._addErrorMessage('options.saveResponses', 'must be defined');
      return;
    }
  }

  _validateSaveScreenshots() {
    const saveScreenshots = this.config.options.saveScreenshots;

    if(saveScreenshots === undefined) {
      this._addErrorMessage('options.saveScreenshots', 'must be defined');
      return;
    }
  }

  _validateClickButtons() {
    const clickButtons = this.config.options.clickButtons;

    if(clickButtons === undefined) {
      this._addErrorMessage('options.clickButtons', 'must be defined');
      return;
    }
  }

  _validateButtonXPath() {
    const buttonXPath = this.config.options.buttonXPath;

    if(buttonXPath === undefined) {
      this._addErrorMessage('options.buttonXPath', 'must be defined');
      return;
    }
  }

  _validateType() {
    const type = this.config.options.type;

    if(type === undefined) {
      this._addErrorMessage('options.type', 'must be defined');
      return;
    }
  }

  _validateAuthenticationType() {
    const authenticationType = this.config.options.authenticationType;

    if(authenticationType === undefined) {
      this._addErrorMessage('options.authenticationType', 'must be defined');
      return;
    }
  }

  _validateMaxDepth() {
    const maxDepth = this.config.options.maxDepth;

    if(maxDepth === undefined) {
      this._addErrorMessage('options.maxDepth', 'must be defined');
      return;
    }
  }

  _validateXhrTimeout() {
    const xhrTimeout = this.config.options.xhrTimeout;

    if(xhrTimeout === undefined) {
      this._addErrorMessage('options.xhrTimeout', 'must be defined');
      return;
    }
  }

  _validatePageTimeout() {
    const pageTimeout = this.config.options.pageTimeout;

    if(pageTimeout === undefined) {
      this._addErrorMessage('options.pageTimeout', 'must be defined');
      return;
    }
  }

  _validateApiEndpointsFile() {
    const apiEndpointsFile = this.config.options.apiEndpointsFile;

    if(apiEndpointsFile === undefined) {
      this._addErrorMessage('options.apiEndpointsFile', 'must be defined');
      return;
    }
  }

  _validatePagesFile() {
    const pagesFile = this.config.options.pagesFile;

    if(pagesFile === undefined) {
      this._addErrorMessage('options.pagesFile', 'must be defined');
      return;
    }
  }

  _validateReportPath() {
    const reportPath = this.config.options.reportPath;

    if(reportPath === undefined) {
      this._addErrorMessage('options.reportPath', 'must be defined');
      return;
    }
  }

  _validateVerboseOutput() {
    const verboseOutput = this.config.options.verboseOutput;

    if(verboseOutput === undefined) {
      this._addErrorMessage('options.verboseOutput', 'must be defined');
      return;
    }
  }

  _validateCookiesTriggeringPage() {
    const cookiesTriggeringPage = this.config.options.cookiesTriggeringPage;
    const authenticationType = this.config.options.authenticationType;

    if(authenticationType !== 'cookie' && cookiesTriggeringPage !== undefined) {
      this._addErrorMessage('options.cookiesTriggeringPage', 'is defined but only gets used when options.authenticationType is set to "cookie"');
      return;
    }
  }

  _validateTokenTriggeringPage() {
    const tokenTriggeringPage = this.config.options.tokenTriggeringPage;
    const authenticationType = this.config.options.authenticationType;

    if(authenticationType !== 'token' && tokenTriggeringPage !== undefined) {
      this._addErrorMessage('options.tokenTriggeringPage', 'is defined but only gets used when options.authenticationType is set to "token"');
      return;
    }
  }

  //============================================================================

  _addErrorMessage(field, message) {
    if(this.errors[field] === undefined) {
      this.errors[field] = [];
    }

    this.errors[field].push(message);
  }
}

module.exports = ConfigValidator;
