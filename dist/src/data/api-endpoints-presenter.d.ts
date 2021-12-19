export default class ApiEndpointsPresenter {
    apiEndpoints: any[];
    constructor(apiEndpoints: any);
    usersRequested(): any[];
    groupedApiEndpoints(): {};
    groupsForView(): {};
    sortedApiEndpoints(): any[];
    _sortApiEndpoints(): void;
    _compareAclKeys(a: any, b: any): boolean;
    _aclTitle(aclJsonString: any): string;
}
