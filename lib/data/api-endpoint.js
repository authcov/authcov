class ApiEndpoint {
  constructor(data = {}, webAppConfig) {
    this.id = data.id;
    this.url = data.url;
    this.method = data.method;
    this.webAppConfig = webAppConfig;

    // Compute whether or not the request is authorised on report generation

    this.requests = data.requests.map(request => {
      request.response.authorised = this.webAppConfig.responseIsAuthorised(request.response, request.response.body);
      return request;
    });
  }

  // An object which shows the access for each user i.e.
  // {'alice@authcov.io': true, 'Public': true, 'bob@authcov.io': true}
  aclKey() {
    const aclKey = {};

    this.requests.forEach((request) => {
      if(aclKey[request.user] === undefined) {
        aclKey[request.user] = request.response.authorised;

      // If we have two requests for the same user, take a logical OR of the two authorised values
      } else if(aclKey[request.user] === false && request.response.authorised === true) {
        aclKey[request.user] = request.response.authorised;
      }
    });

    return aclKey;
  }

  // An object which shows the access for each user i.e.
  // {'alice@authcov.io': { Request... }, 'Public': { Request... }, 'bob@authcov.io': { Request... }}
  aclKeyRequests() {
    const aclKeyRequests = {};

    this.requests.forEach((request) => {
      if(aclKeyRequests[request.user] === undefined) {
        aclKeyRequests[request.user] = request;

      // If we have two requests for the same user, take a logical OR of the two authorised values
      } else if(aclKeyRequests[request.user] === false && request.response.authorised === true) {
        aclKeyRequests[request.user] = request;
      }
    });

    return aclKeyRequests;
  }

  // How many users can access this endpoint
  accessNumber() {
    // Convert true => 1, false => 0, then sum those numbers and compare based on the result
    const trueOneValues = Object.values(this.aclKey()).map((x) => { return x ? 1 : 0; });
    if(trueOneValues.length == 0) {
      return 0;
    } else {
      return trueOneValues.reduce((a, b) => a + b);
    }
  }

  usernamesRequested() {
    return this.requests.map(request => request.user);
  }

  firstValidRequest() {
    return this.requests.find(request => request.response.authorised);
  }
}

module.exports = ApiEndpoint;
