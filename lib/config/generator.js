const fs = require('fs');

function generateConfig(configPath, baseUrl) {
  let defaultConfig = fs.readFileSync('./lib/config/default_config.json').toString();
  defaultConfig = defaultConfig.replace('BASEURL', baseUrl);

  fs.writeFile(configPath, defaultConfig, (error) => {
    if(error) {
      console.log(`Error saving file to: ${configPath}`);
    }
  });
}

module.exports = generateConfig;
