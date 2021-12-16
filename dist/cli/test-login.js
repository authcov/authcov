"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const IntruderCredentialsGrabber = require('../intruder/intruder-credentials-grabber.js');
const ConfigValidator = require('../config/config-validator.js');
const mergeConfigs = require('../config/config-merger.js');
const BaseConfig = require('../config/base-config.js');
function testLogin(configPath, cliOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        let configArgs = require(configPath);
        configArgs = mergeConfigs(configArgs, cliOptions);
        // 1. Validate config params
        const configValidator = new ConfigValidator(configArgs);
        if (configValidator.valid() === false) {
            console.log(configValidator.errorMessage());
            return;
        }
        // 2. Grab Credentials
        const config = new BaseConfig(configArgs);
        const credsGrabber = yield IntruderCredentialsGrabber.init(config);
        console.log(`Logging in as user: ${config.crawlUser.username}...`);
        let authHeaders = yield credsGrabber.getAuthHeaders(config.crawlUser.username, config.crawlUser.password);
        console.log('Got the following authorisation headers:');
        console.log(authHeaders);
        yield credsGrabber.disconnect();
        return;
    });
}
module.exports = testLogin;
