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
    console.log(`Intruding as ${intruder.username} with creds: ${JSON.stringify(intruderHeaders)}`);

    const intrusionRequests = this.apiEndpointData.findIntrusionRequestsForUsername(intruder.username, intruderHeaders);
    console.log(`Found ${intrusionRequests.length} intrusion requests for ${intruder.username}`);

    for(let i = 0; i < intrusionRequests.length; i++) {
      let intrusionRequest = intrusionRequests[i];

      const requestOptions = {
        method: intrusionRequest.method,
        url: intrusionRequest.url,
        headers: intrusionRequest.headers,
        followRedirect: false
      };
      await this._makeRequest(intruder, requestOptions, i, intrusionRequests.length);
    }
  }

  async _makeRequest(intruder, requestOptions, i, total) {
    return new Promise ((resolve, reject) => {
      request(requestOptions, (error, response, body) => {
        if(error !== null) {
          console.error('error:', error); // Print the error if one occurred
        }

        // TODO: update the apiResponseCallback args so we dont need to pass in this ridiculous object
        const responseObj = {
          url(){
            return requestOptions.url;
          },
          request(){
            return { method() { return requestOptions.method; }, headers() { return requestOptions.headers; } };
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

        const progress = `${i+1} / ${total}`;
        console.log(`(${progress}) ${responseObj.url()} => ${responseObj.status()}`);

        this.apiEndpointData.apiResponseCallback(responseObj, null, null, intruder.username);

        setTimeout(() => { resolve() }, 100);
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
