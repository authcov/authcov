import * as fs from 'fs';
import ApiEndpoints from './api-endpoint';
class DataStore {
    constructor(options) {
        if (typeof (options.config) == 'object') {
            this.config = options.config;
        }
    }
    loadFile(filePath) {
        let apiEndpointsJson = fs.readFileSync(filePath);
        this.apiEndpoints = new ApiEndpoints({ data: JSON.parse(apiEndpointsJson), config: this.config });
    }
    saveToFile(fileName) {
        fs.writeFile(fileName, JSON.stringify(this.apiEndpoints.data), (error) => {
            if (error) {
                console.log('Error saving file!');
            }
        });
    }
}
module.exports = DataStore;
//# sourceMappingURL=data-store.js.map