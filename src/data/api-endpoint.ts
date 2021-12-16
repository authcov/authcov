class ApiEndpoint {
  id: string;
  url: string;
  method: string;
  config: any;
  requests: any[];

  constructor(data, config) {
    this.id = data.id;
    this.url = data.url;
    this.method = data.method;
    this.config = config;

    // Compute whether or not the request is authorised on report generation
    this.requests = data.requests.map(request => {
      if(request.response !== undefined) {
        request.response.authorised = this.config.responseIsAuthorised(request.response.status, request.response.headers, request.response.body);
      }
      return request;
    });
  }

  data() {
    return {
      id: this.id,
      url: this.url,
      method: this.method,
      requests: this.requests
    };
  }

  // An object which shows the access for each user i.e.
  // {'alice@authcov.io': true, 'Public': true, 'bob@authcov.io': true}
  aclKey() {
    const aclKey = {};

    this.requests.forEach((request) => {
      if(aclKey[request.user] === undefined && request.response !== undefined) {
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
      if(aclKeyRequests[request.user] === undefined && request.response !== undefined) {
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
      // @ts-ignore
      return trueOneValues.reduce((a, b) => a + b);
    }
  }

  usernamesRequested() {
    return this.requests.map(request => request.user);
  }

  firstValidRequest() {
    return this.requests.find(request => {
      return (request.response !== undefined && request.response.authorised === true);
    });
  }

  // Return only the letters of the url, for use in sorting
  strippedUrl() {
    return this.url.match(/[a-zA-Z0-9]+/g);
  }
}

module.exports = ApiEndpoint;
