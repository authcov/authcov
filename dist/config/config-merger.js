"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mergeConfigs = (config, cliOptions) => {
    Object.keys(config).forEach((key) => {
        if (cliOptions[key] !== undefined) {
            config[key] = cliOptions[key];
        }
    });
    if (cliOptions.browserUrl !== undefined) {
        config.browserURL = cliOptions.browserUrl; //Rename browserUrl => browserURL
    }
    return config;
};
module.exports = mergeConfigs;
