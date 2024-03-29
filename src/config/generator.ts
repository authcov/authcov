import * as fs from 'fs';

export function generateConfig(configPath: string, configTemplatePath: string): void {
  let defaultConfig = fs.readFileSync(configTemplatePath).toString();

  fs.writeFile(configPath, defaultConfig, (error) => {
    if(error) {
      console.log(`Error saving file to: ${configPath}`);
    }
  });
}
