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
// TODO:
const ApiEndpointData = require('../data/api-endpoint-data.js');
const PageData = require('../data/page-data.js');
const ReportGenerator = require('../reporter/report-generator.js');
const ApiEndpointsPresenter = require('../data/api-endpoints-presenter.js');
const configPath = './examples/wordpress-config.js';
function report(configPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = require(configPath);
        const apiEndpointData = new ApiEndpointData({ config: config });
        const pageData = new PageData({ config: config });
        apiEndpointData.loadFile(config.apiEndpointsFile);
        pageData.loadFile(config.pagesFile);
        // 2. Generate the report
        const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
        const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
        reporter.generate(config.reportPath);
        return;
    });
}
module.exports = report;
report(configPath);
