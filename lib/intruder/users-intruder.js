const request = require('request');

class UsersIntruder {
  constructor(webAppConfig, apiEndpointData) {
    this.webAppConfig = webAppConfig;
    this.apiEndpointData = apiEndpointData;
  }

  async start() {
    for(let i = 0; i < this.webAppConfig.users.length; i++) {
      let user = this.webAppConfig.users[i];
      await this.intrudeAsUser(user.username);
    }
    return;
  }

  async intrudeAsUser(username) {
    const intruderHeaders = this.apiEndpointData.findAuthorisationHeadersForUsername(username);

    const intrusionRequests = this.apiEndpointData.findIntrusionRequestsForUsername(username, intruderHeaders);
    console.log(`Found ${intrusionRequests.length} intrusion requests for ${username}`);

    intrusionRequests.forEach((intrusionRequest) => {
      const requestHeaders = Object.assign({}, intrusionRequest.headers);
      delete(requestHeaders['content-length']);
      const requestOptions = {method: intrusionRequest.method, url: intrusionRequest.url, headers: requestHeaders};

      request(requestOptions, (error, response, body) => {
        if(error !== null) {
          console.error('error:', error); // Print the error if one occurred
        }

        if(response.statusCode != 401) {
          console.log(`${response.statusCode} - ${intrusionRequest.url}`);
        }

        // TODO: update the apiResponseCallback args so we dont need to pass in this ridiculous object
        const responseObj = {
          url(){
            return intrusionRequest.url;
          },
          request(){
            return { method() { return intrusionRequest.method; }, headers() { return requestHeaders; } };
          },
          status(){
            return response.statusCode;
          },
          headers(){
            return response.headers;
          },
          async text(){
            return body;
          }
        };

        console.log(`${responseObj.url()} => ${responseObj.status()}`)
        this.apiEndpointData.apiResponseCallback(responseObj, null, null, username);
      });
    });
  }
}

module.exports = UsersIntruder;
