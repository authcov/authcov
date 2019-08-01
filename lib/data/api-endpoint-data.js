const fs = require('fs');
const uuid = require('uuid/v4');

class ApiEndpointData {
  constructor(options = {}) {
    if(typeof(options.webAppConfig) == 'object') {
      this.webAppConfig = options.webAppConfig;
    }

    this.apiEndpoints = [];
  }

  loadFile(filePath) {
    let rawJson = fs.readFileSync(filePath);
    this.apiEndpoints = JSON.parse(rawJson);
  }

  saveToFile(fileName) {
    fs.writeFile(fileName, JSON.stringify(this.apiEndpoints), (error) => {
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
    // For each apiRequest extract the auth headers as defined by webAppConfig
    let apiRequestAuthHeaders = apiRequests.map((apiRequest) => {
      const authHeaders = {};
      const headerKeys = Object.keys(apiRequest.headers);

      // Only select the headers which are also in webAppConfig.authorisationHeaders
      headerKeys.forEach((key) => {
        if(this.webAppConfig.authorisationHeaders.includes(key)) {
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
    this.webAppConfig.authorisationHeaders.forEach((key) => {
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
      const usernamesRequested = apiEndpoint.requests.map(request => request.user);

      // If the userResponse does not contain username
      if(!usernamesRequested.includes(username)) {
        // Find the first authorised userResponse
        // TODO: Don't include requests where pageUrl: null
        const validUserResponse = apiEndpoint.requests.find(userResponse => userResponse.response.authorised);

        // If the request is invalid even for the original requester, then skip it
        if(validUserResponse == undefined) {
          //throw 'No authorised request was found for an API endpoint!';
          return;
        }

        // Deep clone the original request headers
        const originalHeaders = Object.assign({}, validUserResponse.headers);

        // Delete any existing auth headers from the original request
        this.webAppConfig.authorisationHeaders.forEach((key) => { delete originalHeaders[key] });

        // Now overwrite the original headers with the new intrusion auth headers
        const headers = Object.assign(originalHeaders, intruderHeaders);

        const intrusionRequest = {
          intruderUser: username,
          asUser: validUserResponse.user,
          url: apiEndpoint.url,
          method: apiEndpoint.method,
          headers: headers
        }

        intrusionRequests.push(intrusionRequest);
      }
    });

    return intrusionRequests;
  }

  async apiResponseCallback(response, cookies, pageUrl, currentUser) {
    const apiEndpoint = this._findOrCreateApiEndpoint(response.url(), response.request().method());

    const responseAuthorised = this.webAppConfig.responseIsAuthorised(response);
    const user = (currentUser !== undefined) ? currentUser : 'Public';
    const headers = response.request().headers();

    // HACK: See comment in Crawler.login()
    if(cookies !== null) {
      headers.cookie = cookies;
    }

    const responseObj = {
      user: user,
      pageUrl: pageUrl,
      headers: headers,
      response: {
        status: response.status(),
        headers: response.headers(),
        authorised: responseAuthorised
      }
    };

    if(this.webAppConfig.saveResponses === true) {
      // TODO: This sometimes means that the responseObj does not get pushed to requests arr
      responseObj.response.body = await response.text();
    }
    apiEndpoint.requests.push(responseObj);

    this.saveToFile('./tmp/api_endpoints.json');
  }

  _findOrCreateApiEndpoint(url, method) {
    let apiEndpoint = this.apiEndpoints.find((apiEndpoint) => {
      return (apiEndpoint.url == url && apiEndpoint.method == method);
    });

    if(apiEndpoint === undefined) {
      apiEndpoint = {
        id: uuid(),
        url: url,
        method: method,
        requests: []
      };
      this.apiEndpoints.push(apiEndpoint);
    }

    return apiEndpoint;
  }
}

module.exports = ApiEndpointData;
