const mergeConfigs = (config, cliOptions) => {

  Object.keys(config.options).forEach((key) => {
    if(cliOptions[key] !== undefined) {
      config.options[key] = cliOptions[key];
    }
  });

  return config;
};

module.exports = mergeConfigs;
