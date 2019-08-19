class BaseConfig {
  constructor(configArgs) {
    // A bit hacky, happy for suggestions of a better way to do this...
    Object.keys(configArgs).forEach((key) => {
      this[key] = configArgs[key];
    });
  }

  responseIsAuthorised(status, headers, body) {
    return !(this.unAuthorizedStatusCodes.includes(status));
  }

  ignoreLink(url) {
    this.ignoreLinksIncluding.forEach((ignoreStr) => {
      if(url.includes(ignoreStr)) {
        return true;
      }
    });

    return false;
  }
}

module.exports = BaseConfig;
