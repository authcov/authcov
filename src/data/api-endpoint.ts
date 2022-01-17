import Config from '../config/config';

export type HttpResponse = {
  status: number;
  headers: Record<string, string>;
  authorised: boolean;
  body?: string;
}

export type HttpRequest = {
  id: string;
  user: string;
  headers: Record<string, string>;
  pageUrl: string;
  response?: HttpResponse;
}

type ApiEndpointData = {
  id: string;
  url: string;
  method: string;
  requests: HttpRequest[];
}

export type AclKey = Record<string, boolean>

type AclKeyRequests = Record<string, HttpRequest[]>

export default class ApiEndpoint {
  id: string;
  url: string;
  method: string;
  config: Config;
  requests: HttpRequest[];

  constructor(data: ApiEndpointData, config: Config) {
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

  data(): ApiEndpointData {
    return {
      id: this.id,
      url: this.url,
      method: this.method,
      requests: this.requests
    };
  }

  // An object which shows the access for each user i.e.
  // {'alice@authcov.io': true, 'Public': true, 'bob@authcov.io': true}
  aclKey(): AclKey {
    const aclKey = {};

    this.requests.forEach((request: HttpRequest) => {
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
  aclKeyRequests(): AclKeyRequests {
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
  accessNumber(): number {
    // Convert true => 1, false => 0, then sum those numbers and compare based on the result
    const trueOneValues = Object.values(this.aclKey()).map((x) => { return x ? 1 : 0; });
    if(trueOneValues.length == 0) {
      return 0;
    } else {
      // @ts-ignore
      return trueOneValues.reduce((a, b) => a + b);
    }
  }

  usernamesRequested(): string[] {
    return this.requests.map(request => request.user);
  }

  firstValidRequest(): HttpRequest {
    return this.requests.find(request => {
      return (request.response !== undefined && request.response.authorised === true);
    });
  }

  // Return only the letters of the url, for use in sorting
  strippedUrl(): string[] {
    return this.url.match(/[a-zA-Z0-9]+/g);
  }
}
