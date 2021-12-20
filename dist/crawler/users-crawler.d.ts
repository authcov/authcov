import ApiEndpointsCollection from '../data/api-endpoints-collection';
import PageData from '../data/page-data';
import ReportGenerator from '../reporter/report-generator';
import Config from '../config/config';
export default class UsersCrawler {
    config: Config;
    apiEndpointData: ApiEndpointsCollection;
    pageData: PageData;
    reporter: ReportGenerator;
    constructor(config: Config, apiEndpointData: ApiEndpointsCollection, pageData: PageData, reporter: ReportGenerator);
    start(): Promise<void>;
    crawlUser(username: any, password: any): Promise<void>;
}
