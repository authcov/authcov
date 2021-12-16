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
const UsersIntruder = require('../intruder/users-intruder.js');
const ApiEndpointData = require('../data/api-endpoint-data.js');
const ConfigValidator = require('../config/config-validator.js');
const mergeConfigs = require('../config/config-merger.js');
const BaseConfig = require('../config/base-config.js');
const PageData = require('../data/page-data.js');
const ReportGenerator = require('../reporter/report-generator.js');
function intrude(configPath, packagePath, cliOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        let configArgs = require(configPath);
        configArgs = mergeConfigs(configArgs, cliOptions);
        // 1. Validate config params
        const configValidator = new ConfigValidator(configArgs);
        if (configValidator.valid() === false) {
            console.log(configValidator.errorMessage());
            return;
        }
        const config = new BaseConfig(configArgs);
        const apiEndpointData = new ApiEndpointData({ config: config });
        const pageData = new PageData({ config: config });
        // 2. Intrude
        apiEndpointData.loadFile(config.apiEndpointsFile);
        const usersIntruder = new UsersIntruder(config, apiEndpointData);
        yield usersIntruder.start();
        // 3. Generate the report
        pageData.loadFile(config.pagesFile);
        const reporter = new ReportGenerator(apiEndpointData.apiEndpoints, pageData, packagePath);
        reporter.generate(config.reportPath);
        return;
    });
}
module.exports = intrude;
