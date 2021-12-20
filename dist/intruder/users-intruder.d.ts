export default class UsersIntruder {
    config: any;
    apiEndpointData: any;
    constructor(config: any, apiEndpointData: any);
    start(): Promise<void>;
    intrudeAsUser(intruder: any): Promise<void>;
    _makeRequest(intruder: any, requestOptions: any, i: any, total: any): Promise<void>;
    _getAuthHeaders(user: any): Promise<any>;
}
