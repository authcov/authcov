import ApiEndpoint from './api-endpoint';
export default class ApiEndpointsPresenter {
    apiEndpoints: ApiEndpoint[];
    constructor(apiEndpoints: ApiEndpoint[]);
    usersRequested(): any[];
    groupedApiEndpoints(): {};
    groupsForView(): {};
    sortedApiEndpoints(): any[];
    _sortApiEndpoints(): void;
    _compareAclKeys(a: any, b: any): boolean;
    _aclTitle(aclJsonString: any): string;
}
