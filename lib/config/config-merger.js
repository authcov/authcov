const defaultResponseIsAuthorised = function(status, headers, body) {

};


const mergeConfigs = (config, cliOptions) => {
/*
  if(config.responseIsAuthorised === undefined) {
    console.log("responseIsAuthorised is undefined!")
    config.responseIsAuthorised = (status, headers, body) => {
      return true;
    };
  }
*/
  Object.keys(config).forEach((key) => {
    if(cliOptions[key] !== undefined) {
      config[key] = cliOptions[key];
    }
  });

  if(cliOptions.browserUrl !== undefined) {
    config.browserURL = cliOptions.browserUrl //Rename browserUrl => browserURL
  }

  return config;
};

module.exports = mergeConfigs;
