const fs = require('fs');

function generateConfig(configPath, configTemplatePath) {
  let defaultConfig = fs.readFileSync(configTemplatePath).toString();

  fs.writeFile(configPath, defaultConfig, (error) => {
    if(error) {
      console.log(`Error saving file to: ${configPath}`);
    }
  });
}

module.exports = generateConfig;
