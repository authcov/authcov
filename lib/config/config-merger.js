const defaultResponseIsAuthorised = function(status, headers, body) {

};


const mergeConfigs = (config, cliOptions) => {
/*
  if(config.options.responseIsAuthorised === undefined) {
    console.log("responseIsAuthorised is undefined!")
    config.options.responseIsAuthorised = (status, headers, body) => {
      return true;
    };
  }
*/
  Object.keys(config.options).forEach((key) => {
    if(cliOptions[key] !== undefined) {
      config.options[key] = cliOptions[key];
    }
  });

  return config;
};

module.exports = mergeConfigs;
