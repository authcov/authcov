const request = require('request');
const IntruderCredentialsGrabber = require('./intruder-credentials-grabber.js');

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

class UsersIntruder {
  constructor(webAppConfig, apiEndpointData) {
    this.webAppConfig = webAppConfig;
    this.apiEndpointData = apiEndpointData;
  }

  async start() {
    for(let i = 0; i < this.webAppConfig.intruders.length; i++) {
      let intruder = this.webAppConfig.intruders[i];
      await this.intrudeAsUser(intruder);
    }
    return;
  }

  async intrudeAsUser(intruder) {
    const intruderHeaders = await this._getAuthHeaders(intruder);
    console.log(`Intrudering as ${intruder.username} with creds: ${JSON.stringify(intruderHeaders)}`);

    const intrusionRequests = this.apiEndpointData.findIntrusionRequestsForUsername(intruder.username, intruderHeaders);
    console.log(`Found ${intrusionRequests.length} intrusion requests for ${intruder.username}`);

    for(let i = 0; i < intrusionRequests.length; i++) {
      let intrusionRequest = intrusionRequests[i];

      const requestHeaders = Object.assign({}, intrusionRequest.headers);
      delete(requestHeaders['content-length']);
      const requestOptions = {method: intrusionRequest.method, url: intrusionRequest.url, headers: requestHeaders};

      await this._makeRequest(intruder, requestOptions, intrusionRequest);
    }
  }

  async _makeRequest(intruder, requestOptions, intrusionRequest) {
    return new Promise ((resolve, reject) => {
      request(requestOptions, (error, response, body) => {
        if(error !== null) {
          console.error('error:', error); // Print the error if one occurred
        }

        // TODO: update the apiResponseCallback args so we dont need to pass in this ridiculous object
        const responseObj = {
          url(){
            return intrusionRequest.url;
          },
          request(){
            return { method() { return intrusionRequest.method; }, headers() { return requestOptions.headers; } };
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

        this.apiEndpointData.apiResponseCallback(responseObj, null, null, intruder.username);

        setTimeout(() => { resolve() }, 500);
      });
    });
  }

  async _getAuthHeaders(user) {
    let intruderHeaders;

    if(user.username == 'Public') {
      intruderHeaders = {};
    } else {
      const credsGrabber = await IntruderCredentialsGrabber.init(this.webAppConfig);
      intruderHeaders = await credsGrabber.getAuthHeaders(user.username, user.password);
      credsGrabber.disconnect();
    }

    return intruderHeaders;
  }
}

module.exports = UsersIntruder;
