import ApiEndpointData from '../data/api-endpoint-data';
import PageData from '../data/page-data';
import ReportGenerator from '../reporter/report-generator';
import Config from '../config/config';
export default class UsersCrawler {
    config: Config;
    apiEndpointData: ApiEndpointData;
    pageData: PageData;
    reporter: ReportGenerator;
    constructor(config: Config, apiEndpointData: ApiEndpointData, pageData: PageData, reporter: ReportGenerator);
    start(): Promise<void>;
    crawlUser(username: any, password: any): Promise<void>;
}
