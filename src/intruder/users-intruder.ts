import chalk from 'chalk';
import axios from 'axios';
import IntruderCredentialsGrabber from './intruder-credentials-grabber';

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export default class UsersIntruder {
  config: any;
  apiEndpointData: any;

  constructor(config, apiEndpointData) {
    this.config = config;
    this.apiEndpointData = apiEndpointData;
  }

  async start() {
    const startTime = Date.now();

    for(let i = 0; i < this.config.intruders.length; i++) {
      let intruder = this.config.intruders[i];
      await this.intrudeAsUser(intruder);
    }

    const diff = (Date.now() - startTime) / 1000;
    console.log(`Finished in ${diff} sec`);

    return;
  }

  async intrudeAsUser(intruder) {
    const intruderHeaders = await this._getAuthHeaders(intruder);
    console.log(`Intruding as ${intruder.username} with headers: ${JSON.stringify(intruderHeaders)}`);

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
    const response = await axios({
      method: requestOptions.method,
      url: requestOptions.url,
      headers: requestOptions.headers,
      maxRedirects: 0,
      validateStatus: () => true
    });

    // TODO: update the apiResponseCallback args so we dont need to pass in this ridiculous object
    const responseObj = {
      url(){
        return requestOptions.url;
      },
      request(){
        return {
          url() { return requestOptions.url },
          method() { return requestOptions.method; },
          headers() { return requestOptions.headers; }
        };
      },
      status(){
        return response.status;
      },
      headers(){
        return response.headers;
      },
      async text(){
        return response.data;
      }
    };

    const progress = `${i+1} / ${total}`;
    const responseAuthorised = this.config.responseIsAuthorised(response.status, response.headers, response.data);
    const logText = `(${progress}) ${responseObj.url()} => ${responseObj.status()}`;
    if(responseAuthorised === true) {
      console.log(chalk.green(logText));
    } else {
      console.log(chalk.red(logText));
    }

    this.apiEndpointData.apiRequestCallback(responseObj.request(), null, null, intruder.username);
    this.apiEndpointData.apiResponseCallback(responseObj, null, null, intruder.username);
  }

  async _getAuthHeaders(user) {
    let intruderHeaders;

    if(user.username == 'Public') {
      intruderHeaders = {};
    } else {
      const credsGrabber = await IntruderCredentialsGrabber.init(this.config);
      intruderHeaders = await credsGrabber.getAuthHeaders(user.username, user.password);
      credsGrabber.disconnect();
    }

    return intruderHeaders;
  }
}
