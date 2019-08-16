const fs = require('fs');
const uuid = require('uuid/v4');
const ApiEndpoint = require('./api-endpoint.js');

class ApiEndpointData {
  constructor(options = {}) {
    if(typeof(options.config) == 'object') {
      this.config = options.config;
    }

    this.apiEndpoints = [];
  }

  loadFile(filePath) {
    let rawJson = fs.readFileSync(filePath);
    this.apiEndpoints = JSON.parse(rawJson).map((data) => new ApiEndpoint(data, this.config));
  }

  saveToFile(fileName) {
    // Sort alphabetically by URL
    this.apiEndpoints = this.apiEndpoints.sort(function(a, b){
      if(a.strippedUrl() < b.strippedUrl()) { return -1; }
      if(a.strippedUrl() > b.strippedUrl()) { return 1; }
      return 0;
    });

    const apiEndpointsData = this.apiEndpoints.map(apiEndpoint => apiEndpoint.data());
    fs.writeFileSync(fileName, JSON.stringify(apiEndpointsData, null, 2), (error) => {
      if(error) {
        console.log('Error saving file!');
      }
    });
  }

  urlCrawledCallback(url) {
    console.log("URL Crawled: " + url);
  }

  findAuthorisationHeadersForUsername(username) {
    const apiRequests = this.findApiRequestsForUsername(username);
    // For each apiRequest extract the auth headers as defined by config
    let apiRequestAuthHeaders = apiRequests.map((apiRequest) => {
      const authHeaders = {};
      const headerKeys = Object.keys(apiRequest.headers);

      // Only select the headers which are also in config.authorisationHeaders
      headerKeys.forEach((key) => {
        if(this.config.authorisationHeaders.includes(key)) {
          authHeaders[key] = apiRequest.headers[key];
        }
      });

      return authHeaders;
    });

    // Filter out the empty header objects
    apiRequestAuthHeaders = apiRequestAuthHeaders.filter((headers) => {
      return (Object.keys(headers).length > 0);
    });

    // Ensure there are not multiple values for each authorisationHeader
    this.config.authorisationHeaders.forEach((key) => {
      const headers = apiRequestAuthHeaders.map(headers => headers[key]);
      const uniqValues = [...new Set(headers)];

      if(uniqValues > 1) {
        throw `Multiple authorisation headers found for header: ${key}!`;
      }
    });

    if(apiRequestAuthHeaders.length > 0) {
      return apiRequestAuthHeaders[0];
    } else {
      return {};
    }
  }

  findApiRequestsForUsername(username) {
    const apiRequests = [];

    this.apiEndpoints.forEach((apiEndpoint) => {
      apiEndpoint.requests.forEach((userResponse) => {

        // Return each non-Intrusion request+UserReponse which belongs to this user
        if(userResponse.pageUrl != null && userResponse.user == username) {
          const apiRequest = {
            url: apiEndpoint.url,
            method: apiEndpoint.method,
            headers: userResponse.headers,
            pageUrl: userResponse.pageUrl,
            response: userResponse.response
          };

          apiRequests.push(apiRequest);
        }
      });
    });

    return apiRequests;
  }

  findIntrusionRequestsForUsername(username, intruderHeaders) {
    //return this.findIntrusionRequests().filter((intrusionRequest) => { return (intrusionRequest.intruderUser == username);});
    let intrusionRequests = [];

    // For each apiRequest:
    this.apiEndpoints.forEach((apiEndpoint) => {
      if(!apiEndpoint.usernamesRequested().includes(username)) {
        // If the request is invalid even for the original requester, then skip it
        const validRequest = apiEndpoint.firstValidRequest();
        if(validRequest == undefined) {
          //throw 'No authorised request was found for an API endpoint!';
          return;
        }

        // Deep clone the original request headers
        const originalHeaders = Object.assign({}, validRequest.headers);

        // Delete any existing auth headers from the original request
        this.config.authorisationHeaders.forEach((key) => { delete originalHeaders[key] });

        // Now overwrite the original headers with the new intrusion auth headers
        const headers = Object.assign(originalHeaders, intruderHeaders);
        delete(headers['content-length']);

        const intrusionRequest = {
          intruderUser: username,
          asUser: validRequest.user,
          url: apiEndpoint.url,
          method: apiEndpoint.method,
          headers: headers
        }

        intrusionRequests.push(intrusionRequest);
      }
    });

    return intrusionRequests;
  }

  // Used in MPA mode to save the request and response of a page being loaded in the browser.
  async mpaPageResponseCallback(response, cookies, pageUrl, currentUser) {
    const apiEndpoint = this._findOrCreateApiEndpoint(response.url(), response.request().method());
    const responseBody = await response.text();
    const responseAuthorised = this.config.responseIsAuthorised(response.status(), response.headers(), responseBody);
    const user = (currentUser !== undefined) ? currentUser : 'Public';
    const headers = response.request().headers();

    // HACK: See comment in Crawler.login()
    if(cookies !== null) {
      headers.cookie = cookies;
    }

    const requestObj = {
      id: uuid(),
      user: user,
      pageUrl: pageUrl,
      headers: headers,
      response: {
        status: response.status(),
        headers: response.headers(),
        authorised: responseAuthorised
      }
    };

    if(this.config.saveResponses === true) {
      requestObj.response.body = responseBody;
    }
    apiEndpoint.requests.push(requestObj);

    this.saveToFile('./tmp/api_endpoints.json');
  }

  apiRequestCallback(request, cookies, pageUrl, currentUser) {
    this._verboseLog(`Intercepted API request to: ${request.method()} ${request.url()}`)
    const apiEndpoint = this._findOrCreateApiEndpoint(request.url(), request.method());
    const user = (currentUser !== undefined) ? currentUser : 'Public';
    const headers = request.headers();
    // HACK: See comment in Crawler.login()
    if(cookies !== null) {
      headers.cookie = cookies;
    }

    const requestObj = {
      id: uuid(),
      user: user,
      pageUrl: pageUrl,
      headers: headers
    };

    apiEndpoint.requests.push(requestObj);
  }

  async apiResponseCallback(response, cookies, pageUrl, currentUser) {
    this._verboseLog(`Intercepted API response from: ${response.request().method()} ${response.url()}`)
    const apiEndpoint = this._findOrCreateApiEndpoint(response.url(), response.request().method());

    const responseBody = await response.text();
    const responseAuthorised = this.config.responseIsAuthorised(response.status(), response.headers(), responseBody);
    const user = (currentUser !== undefined) ? currentUser : 'Public';

    const requestObj = apiEndpoint.requests.find((request) => {
      return (request.user == user && request.pageUrl == pageUrl);
    });

    if(requestObj === undefined) {
      throw `Could not find a request for response from: ${response.request().method()} ${response.url()}, pageUrl: ${pageUrl}`;
    }

    const responseObj = {
      status: response.status(),
      headers: response.headers(),
      authorised: responseAuthorised
    };

    if(this.config.saveResponses === true) {
      responseObj.body = responseBody;
    }

    requestObj.response = responseObj;
    this.saveToFile('./tmp/api_endpoints.json');
  }

  _findOrCreateApiEndpoint(url, method) {
    let apiEndpoint = this.apiEndpoints.find((apiEndpoint) => {
      return (apiEndpoint.url == url && apiEndpoint.method == method);
    });

    if(apiEndpoint === undefined) {
      apiEndpoint = new ApiEndpoint({
        id: uuid(),
        url: url,
        method: method,
        requests: []
      });
      this.apiEndpoints.push(apiEndpoint);
    }

    return apiEndpoint;
  }

  _verboseLog(message) {
    if(this.config.verboseOutput === true) {
      console.log(message);
    }
  }

  scanCompleteCallback() {
    console.log(`Discovered ${this.apiEndpoints.length} api-endpoints`);
  }
}

module.exports = ApiEndpointData;
