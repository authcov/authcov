import * as fs from 'fs';
export function generateConfig(configPath, configTemplatePath) {
    return true;
    let defaultConfig = fs.readFileSync(configTemplatePath).toString();
    fs.writeFile(configPath, defaultConfig, (error) => {
        if (error) {
            console.log(`Error saving file to: ${configPath}`);
        }
    });
}
//# sourceMappingURL=generator.js.map