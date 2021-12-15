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
    this._validateType();
    this._validateAuthenticationType();
    this._validateMaxDepth();
    this._validateXhrTimeout();
    this._validatePageTimeout();
    this._validateVerboseOutput();
    this._validateCookiesTriggeringPage();
    this._validateTokenTriggeringPage();
    this._validateUnAuthorizedStatusCodes();
    this._validateignoreLinksIncluding();
    //this._validateignoreButtonsIncluding();
    //this._validateignoreAPIrequestsIncluding();
    this._validateloginConfig();
  }

  _validateCrawlUser() {
    const crawlUser = this.config.crawlUser;

    if(crawlUser === undefined) {
      this._addErrorMessage('config.crawlUser', 'must be defined');
      return;
    }

    if(typeof(crawlUser) !== 'object') {
      this._addErrorMessage('config.crawlUser', 'must be an object');
      return;
    }

    if(typeof(crawlUser.username) !== 'string' || typeof(crawlUser.password) !== 'string') {
      this._addErrorMessage('config.crawlUser', 'must have fields username and password defined as strings');
      return;
    }
  }

  _validateIntruders() {
    const intruders = this.config.intruders;

    if(intruders === undefined) {
      this._addErrorMessage('config.intruders', 'must be defined');
      return;
    }

    if(typeof(intruders) === 'array') {
      this._addErrorMessage('config.intruders', 'must be an array of user objects');
      return;
    }

    intruders.forEach((intruder) => {
      if(typeof(intruder) !== 'object') {
        this._addErrorMessage('config.intruders[]', 'must be an object');
        return;
      }

      if(typeof(intruder.username) !== 'string') {
        this._addErrorMessage('config.intruders[]', 'must have fields username and password defined as strings (unless its a public user)');
        return;
      }
    });
  }

  _validateAuthorisationHeaders() {
    const authorisationHeaders = this.config.authorisationHeaders;

    if(authorisationHeaders !== undefined) {
      if(typeof(authorisationHeaders) === 'array') {
        this._addErrorMessage('config.authorisationHeaders', 'must be an array of strings');
        return;
      }
    }
  }

  _validateBaseUrl() {
    const baseUrl = this.config.baseUrl;

    if(baseUrl === undefined) {
      this._addErrorMessage('config.baseUrl', 'must be defined');
      return;
    }
  }

  _validateSaveResponses() {
    const saveResponses = this.config.saveResponses;

    if(saveResponses === undefined) {
      this._addErrorMessage('config.saveResponses', 'must be defined');
      return;
    }
  }

  _validateSaveScreenshots() {
    const saveScreenshots = this.config.saveScreenshots;

    if(saveScreenshots === undefined) {
      this._addErrorMessage('config.saveScreenshots', 'must be defined');
      return;
    }
  }

  _validateClickButtons() {
    const clickButtons = this.config.clickButtons;

    if(clickButtons === undefined) {
      this._addErrorMessage('config.clickButtons', 'must be defined');
      return;
    }
  }

  _validateType() {
    const type = this.config.type;

    if(type === undefined) {
      this._addErrorMessage('config.type', 'must be defined');
      return;
    }

    if(!['spa', 'mpa'].includes(type)) {
      this._addErrorMessage('config.type', 'must be either "mpa" or "spa"');
      return;
    }
  }

  _validateAuthenticationType() {
    const authenticationType = this.config.authenticationType;

    if(authenticationType === undefined) {
      this._addErrorMessage('config.authenticationType', 'must be defined');
      return;
    }

    if(!['cookie', 'token'].includes(authenticationType)) {
      this._addErrorMessage('config.authenticationType', 'must be either "cookie" or "token"');
      return;
    }
  }

  _validateMaxDepth() {
    const maxDepth = this.config.maxDepth;

    if(maxDepth === undefined) {
      this._addErrorMessage('config.maxDepth', 'must be defined');
      return;
    }
  }

  _validateXhrTimeout() {
    const xhrTimeout = this.config.xhrTimeout;

    if(xhrTimeout === undefined) {
      this._addErrorMessage('config.xhrTimeout', 'must be defined');
      return;
    }
  }

  _validatePageTimeout() {
    const pageTimeout = this.config.pageTimeout;

    if(pageTimeout === undefined) {
      this._addErrorMessage('config.pageTimeout', 'must be defined');
      return;
    }
  }

  _validateVerboseOutput() {
    const verboseOutput = this.config.verboseOutput;

    if(verboseOutput === undefined) {
      this._addErrorMessage('config.verboseOutput', 'must be defined');
      return;
    }
  }

  _validateCookiesTriggeringPage() {
    const cookiesTriggeringPage = this.config.cookiesTriggeringPage;
    const authenticationType = this.config.authenticationType;

    if(authenticationType !== 'cookie' && cookiesTriggeringPage !== undefined) {
      this._addErrorMessage('config.cookiesTriggeringPage', 'is defined but only gets used when config.authenticationType is set to "cookie"');
      return;
    }
  }

  _validateTokenTriggeringPage() {
    const tokenTriggeringPage = this.config.tokenTriggeringPage;
    const authenticationType = this.config.authenticationType;

    if(authenticationType !== 'token' && tokenTriggeringPage !== undefined) {
      this._addErrorMessage('config.tokenTriggeringPage', 'is defined but only gets used when config.authenticationType is set to "token"');
      return;
    }
  }

  _validateUnAuthorizedStatusCodes() {
    this._validateFunctionOrArrayField('unAuthorizedStatusCodes', 'responseIsAuthorised');
  }

  _validateignoreLinksIncluding() {
    this._validateFunctionOrArrayField('ignoreLinksIncluding', 'ignoreLink');
  }
/*
  _validateignoreButtonsIncluding() {
    this._validateFunctionOrArrayField('ignoreButtonsIncluding', 'ignoreButton');
  }

  _validateignoreAPIrequestsIncluding() {
    this._validateFunctionOrArrayField('ignoreAPIrequestsIncluding', 'ignoreApiRequest');
  }
*/
  _validateloginConfig() {
    const requiredFields = ['url', 'usernameXpath', 'passwordXpath', 'submitXpath'];
    const textField = this.config.loginConfig;
    const funcField = this.config.loginFunction;

    if(textField !== undefined && funcField !== undefined) {
      console.log(chalk.yellow(
        `WARN: Both config.loginConfig and loginFunction() are defined, using loginFunction()`
      ));
    } else if(textField !== undefined && funcField === undefined) {

      if(typeof(textField) !== 'object') {
        this._addErrorMessage(`config.loginConfig`, `must be an object.`);
        return;
      } else {
        requiredFields.forEach((field) => {
          if(textField[field] === undefined) {
            this._addErrorMessage(`config.loginConfig.${field}`, `must be defined.`);
          }
        });
      }

    } else if(textField === undefined && funcField !== undefined) {

      if(typeof(funcField) !== 'function') {
        this._addErrorMessage(`config.loginFunction`, `must be a function.`);
        return;
      }

    }
  }


  //============================================================================

  _validateFunctionOrArrayField(textFieldKey, funcFieldKey) {
    const textField = this.config[textFieldKey];
    const funcField = this.config[funcFieldKey];

    if(textField !== undefined && funcField !== undefined) {
      console.log(chalk.yellow(
        `WARN: Both config.${textFieldKey} and ${funcFieldKey}() are defined, using ${funcFieldKey}()`
      ));
    } else if(textField === undefined && funcField === undefined) {
      this._addErrorMessage(`config.${textFieldKey}`, `must be defined or the function ${funcFieldKey}() must be defined.`);
      return;
    } else if(textField !== undefined && funcField === undefined) {

      if(Array.isArray(textField) === false) {
        this._addErrorMessage(`config.${textFieldKey}`, `must be an array.`);
        return;
      }

    } else if(textField === undefined && funcField !== undefined) {

      if(typeof(funcField) !== 'function') {
        this._addErrorMessage(`config.${funcFieldKey}`, `must be a function.`);
        return;
      }

    }
  }

  _addErrorMessage(field, message) {
    if(this.errors[field] === undefined) {
      this.errors[field] = [];
    }

    this.errors[field].push(message);
  }
}

module.exports = ConfigValidator;
