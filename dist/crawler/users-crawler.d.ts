import ApiEndpointData from '../data/api-endpoint-data';
import PageData from '../data/page-data';
import ReportGenerator from '../reporter/report-generator';
export default class UsersCrawler {
    config: any;
    apiEndpointData: ApiEndpointData;
    pageData: PageData;
    reporter: ReportGenerator;
    constructor(config: any, apiEndpointData: any, pageData: any, reporter: any);
    start(): Promise<void>;
    crawlUser(username: any, password: any): Promise<void>;
}
