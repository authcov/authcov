declare const chalk: any;
declare const request: any;
declare const IntruderCredentialsGrabber: any;
declare function sleep(ms: any): Promise<unknown>;
declare class UsersIntruder {
    config: any;
    apiEndpointData: any;
    constructor(config: any, apiEndpointData: any);
    start(): Promise<void>;
    intrudeAsUser(intruder: any): Promise<void>;
    _makeRequest(intruder: any, requestOptions: any, i: any, total: any): Promise<unknown>;
    _getAuthHeaders(user: any): Promise<any>;
}
