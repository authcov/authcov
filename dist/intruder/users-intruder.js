var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const chalk = require('chalk');
const request = require('request');
const IntruderCredentialsGrabber = require('./intruder-credentials-grabber.js');
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    });
}
class UsersIntruder {
    constructor(config, apiEndpointData) {
        this.config = config;
        this.apiEndpointData = apiEndpointData;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            for (let i = 0; i < this.config.intruders.length; i++) {
                let intruder = this.config.intruders[i];
                yield this.intrudeAsUser(intruder);
            }
            const diff = (Date.now() - startTime) / 1000;
            console.log(`Finished in ${diff} sec`);
            return;
        });
    }
    intrudeAsUser(intruder) {
        return __awaiter(this, void 0, void 0, function* () {
            const intruderHeaders = yield this._getAuthHeaders(intruder);
            console.log(`Intruding as ${intruder.username} with headers: ${JSON.stringify(intruderHeaders)}`);
            const intrusionRequests = this.apiEndpointData.findIntrusionRequestsForUsername(intruder.username, intruderHeaders);
            console.log(`Found ${intrusionRequests.length} intrusion requests for ${intruder.username}`);
            for (let i = 0; i < intrusionRequests.length; i++) {
                let intrusionRequest = intrusionRequests[i];
                const requestOptions = {
                    method: intrusionRequest.method,
                    url: intrusionRequest.url,
                    headers: intrusionRequest.headers,
                    followRedirect: false
                };
                yield this._makeRequest(intruder, requestOptions, i, intrusionRequests.length);
            }
        });
    }
    _makeRequest(intruder, requestOptions, i, total) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                request(requestOptions, (error, response, body) => {
                    if (error !== null) {
                        console.error('error:', error); // Print the error if one occurred
                    }
                    // TODO: update the apiResponseCallback args so we dont need to pass in this ridiculous object
                    const responseObj = {
                        url() {
                            return requestOptions.url;
                        },
                        request() {
                            return {
                                url() { return requestOptions.url; },
                                method() { return requestOptions.method; },
                                headers() { return requestOptions.headers; }
                            };
                        },
                        status() {
                            return response.statusCode;
                        },
                        headers() {
                            return response.headers;
                        },
                        text() {
                            return __awaiter(this, void 0, void 0, function* () {
                                return body;
                            });
                        }
                    };
                    const progress = `${i + 1} / ${total}`;
                    const responseAuthorised = this.config.responseIsAuthorised(response.statusCode, response.headers, body);
                    const logText = `(${progress}) ${responseObj.url()} => ${responseObj.status()}`;
                    if (responseAuthorised === true) {
                        console.log(chalk.green(logText));
                    }
                    else {
                        console.log(chalk.red(logText));
                    }
                    this.apiEndpointData.apiRequestCallback(responseObj.request(), null, null, intruder.username);
                    this.apiEndpointData.apiResponseCallback(responseObj, null, null, intruder.username);
                    setTimeout(() => { resolve(undefined); }, 100);
                });
            });
        });
    }
    _getAuthHeaders(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let intruderHeaders;
            if (user.username == 'Public') {
                intruderHeaders = {};
            }
            else {
                const credsGrabber = yield IntruderCredentialsGrabber.init(this.config);
                intruderHeaders = yield credsGrabber.getAuthHeaders(user.username, user.password);
                credsGrabber.disconnect();
            }
            return intruderHeaders;
        });
    }
}
module.exports = UsersIntruder;
