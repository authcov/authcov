const fs = require('fs');

function generateConfig(configPath) {
  let defaultConfig = fs.readFileSync('./lib/config/config-template.js').toString();

  fs.writeFile(configPath, defaultConfig, (error) => {
    if(error) {
      console.log(`Error saving file to: ${configPath}`);
    }
  });
}

module.exports = generateConfig;
