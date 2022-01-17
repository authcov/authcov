import chalk from 'chalk';
import axios, { Method } from 'axios';
import IntruderCredentialsGrabber from './intruder-credentials-grabber';
import Config from '../config/config';
import ApiEndpointsCollection, { IntrusionRequest } from '../data/api-endpoints-collection';
import { HTTPRequest, HTTPResponse } from 'puppeteer';
import { User } from '../config/config';

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export default class UsersIntruder {
  config: Config;
  apiEndpoints: ApiEndpointsCollection;

  constructor(config: Config, apiEndpoints: ApiEndpointsCollection) {
    this.config = config;
    this.apiEndpoints = apiEndpoints;
  }

  async start(): Promise<void> {
    const startTime = Date.now();

    for(let i = 0; i < this.config.intruders.length; i++) {
      let intruder = this.config.intruders[i];
      await this.intrudeAsUser(intruder);
    }

    const diff = (Date.now() - startTime) / 1000;
    console.log(`Finished in ${diff} sec`);

    return;
  }

  async intrudeAsUser(intruder: User): Promise<void> {
    const intruderHeaders = await this._getAuthHeaders(intruder);
    console.log(`Intruding as ${intruder.username} with headers: ${JSON.stringify(intruderHeaders)}`);

    const intrusionRequests = this.apiEndpoints.findIntrusionRequestsForUsername(intruder.username, intruderHeaders);
    console.log(`Found ${intrusionRequests.length} intrusion requests for ${intruder.username}`);

    for(let i = 0; i < intrusionRequests.length; i++) {
      let intrusionRequest = intrusionRequests[i];
      await this._makeRequest(intruder, intrusionRequest, i, intrusionRequests.length);
    }
  }

  async _makeRequest(intruder: User, request: IntrusionRequest, i, total): Promise<void> {
    const response = await axios({
      method: request.method as Method,
      url: request.url,
      headers: request.headers,
      maxRedirects: 0,
      validateStatus: () => true
    });

    // TODO: update the apiResponseCallback args so we dont need to pass in this ridiculous object
    const responseObj = {
      url(){
        return request.url;
      },
      request(): HTTPRequest {
        return {
          url() { return request.url },
          method() { return request.method; },
          headers() { return request.headers; }
        } as HTTPRequest;
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
    } as HTTPResponse;

    const progress = `${i+1} / ${total}`;
    const responseAuthorised = this.config.responseIsAuthorised(response.status, response.headers, response.data);
    const logText = `(${progress}) ${responseObj.url()} => ${responseObj.status()}`;
    if(responseAuthorised === true) {
      console.log(chalk.green(logText));
    } else {
      console.log(chalk.red(logText));
    }

    this.apiEndpoints.apiRequestCallback(responseObj.request(), null, null, intruder.username);
    this.apiEndpoints.apiResponseCallback(responseObj, null, null, intruder.username);
  }

  async _getAuthHeaders(user: User): Promise<Record<string,string>> {
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
