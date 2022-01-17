import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

import ApiEndpoint from './api-endpoint';
import Config from '../config/config';
import { HTTPRequest, HTTPResponse } from 'puppeteer';

export type IntrusionRequest = {
  intruderUser: string
  asUser: string,
  url: string,
  method: string,
  headers: Record<string, string>
}

export default class ApiEndpointsCollection {
  config: Config;
  apiEndpoints: ApiEndpoint[];

  constructor(config: Config) {
    this.config = config;
    this.apiEndpoints = [];
  }

  loadFile(filePath: string): void {
    let rawJson = fs.readFileSync(filePath);
    this.apiEndpoints = JSON.parse(rawJson.toString()).map((data) => new ApiEndpoint(data, this.config));
  }

  saveToFile(fileName: string): void {
    // Sort alphabetically by URL
    this.apiEndpoints = this.apiEndpoints.sort(function(a, b){
      if(a.strippedUrl() < b.strippedUrl()) { return -1; }
      if(a.strippedUrl() > b.strippedUrl()) { return 1; }
      return 0;
    });

    const apiEndpointsData = this.apiEndpoints.map(apiEndpoint => apiEndpoint.data());
    fs.writeFileSync(fileName, JSON.stringify(apiEndpointsData, null, 2));
  }

  urlCrawledCallback(url: string): void {
    console.log("URL Crawled: " + url);
  }

  findApiRequestsForUsername(username: string): ApiEndpoint[] {
    const apiRequests = [];

    this.apiEndpoints.forEach((apiEndpoint) => {
      apiEndpoint.requests.forEach((request) => {

        // Return each non-Intrusion request+UserReponse which belongs to this user
        if(request.pageUrl != null && request.user == username) {
          apiRequests.push(request);
        }
      });
    });

    return apiRequests;
  }

  findIntrusionRequestsForUsername(username: string, intruderHeaders: Record<string, string>): IntrusionRequest[] {
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

        const intrusionRequest: IntrusionRequest = {
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
  async mpaPageResponseCallback(response: HTTPResponse, cookies: string, pageUrl: string, currentUser: string): Promise<void> {
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
      requestObj.response = Object.assign({ body: responseBody }, requestObj.response);
    }
    apiEndpoint.requests.push(requestObj);

    this.saveToFile('./api_endpoints.json');
  }

  apiRequestCallback(request: HTTPRequest, cookies: string, pageUrl: string, currentUser: string): void {
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

  async apiResponseCallback(response: HTTPResponse, cookies: string, pageUrl: string, currentUser: string): Promise<void> {
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
      requestObj.response = Object.assign({ body: responseBody }, requestObj.response);
    }

    requestObj.response = responseObj;
    this.saveToFile('./api_endpoints.json');
  }

  _findOrCreateApiEndpoint(url: string, method: string): ApiEndpoint {
    let apiEndpoint = this.apiEndpoints.find((apiEndpoint) => {
      return (apiEndpoint.url == url && apiEndpoint.method == method);
    });

    if(apiEndpoint === undefined) {
      apiEndpoint = new ApiEndpoint({
        id: uuid(),
        url: url,
        method: method,
        requests: []
      }, this.config);
      this.apiEndpoints.push(apiEndpoint);
    }

    return apiEndpoint;
  }

  _verboseLog(message: string): void {
    if(this.config.verboseOutput === true) {
      console.log(message);
    }
  }

  scanCompleteCallback(): void {
    console.log(`Discovered ${this.apiEndpoints.length} api-endpoints`);
  }
}
