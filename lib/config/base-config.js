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
    let ignore = false;

    this.ignoreLinksIncluding.forEach((ignoreStr) => {
      if(url.includes(ignoreStr)) {
        ignore = true;
      }
    });

    return ignore;
  }

  ignoreApiRequest(url, method) {
    let ignore = false;

    this.ignoreAPIrequestsIncluding.forEach((ignoreStr) => {
      if(url.includes(ignoreStr)) {
        ignore = true;
      }
    });

    return ignore;
  }
}

module.exports = BaseConfig;
