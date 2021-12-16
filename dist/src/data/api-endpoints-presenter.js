export default class ApiEndpointsPresenter {
    constructor(apiEndpoints) {
        this.apiEndpoints = apiEndpoints;
    }
    // Return all the users that have made requests in the data
    usersRequested() {
        const users = [];
        this.apiEndpoints.forEach(apiEndpoint => {
            apiEndpoint.requests.forEach(request => {
                users.push(request.user);
            });
        });
        return [...new Set(users)];
    }
    // Group endpoints using the JSON aclKey() as the index
    groupedApiEndpoints() {
        const groupedEndpoints = {};
        this.apiEndpoints.forEach(apiEndpoint => {
            const key = JSON.stringify(apiEndpoint.aclKey());
            if (groupedEndpoints[key] === undefined) {
                groupedEndpoints[key] = [];
            }
            groupedEndpoints[key].push(apiEndpoint);
        });
        return groupedEndpoints;
    }
    groupsForView() {
        const groupedEndpoints = this.groupedApiEndpoints();
        const groupedApiEndpointsForView = {};
        Object.keys(groupedEndpoints).forEach((key) => {
            const aclTitle = this._aclTitle(key);
            groupedApiEndpointsForView[aclTitle] = groupedEndpoints[key];
        });
        return groupedApiEndpointsForView;
    }
    sortedApiEndpoints() {
        const groupEndpoints = this.groupedApiEndpoints();
        let sortedEndpoints = [];
        Object.values(groupEndpoints).forEach(endpointsGroup => {
            sortedEndpoints = sortedEndpoints.concat(endpointsGroup);
        });
        return sortedEndpoints.sort((a, b) => { return b.accessNumber() - a.accessNumber(); }); // Descending
    }
    // Sort by the number of authorised user requests
    _sortApiEndpoints() {
        // @ts-ignore
        this.apiEndpoints.sort((a, b) => { return this._compareAclKeys(a, b); });
    }
    _compareAclKeys(a, b) {
        const aValue = a.accessNumber();
        const bValue = b.accessNumber();
        return (aValue < bValue); // Descending
    }
    _aclTitle(aclJsonString) {
        const aclObj = JSON.parse(aclJsonString);
        const uniqValues = [...new Set(Object.values(aclObj))];
        const trueValues = {};
        Object.keys(aclObj).forEach((key) => {
            if (aclObj[key] === true) {
                trueValues[key] = true;
            }
        });
        const trueValuesNum = Object.keys(trueValues).length;
        if (JSON.stringify(uniqValues) === JSON.stringify([true])) {
            return 'Accessible to everyone';
        }
        else if (JSON.stringify(uniqValues) === JSON.stringify([false])) {
            return 'Accessible to no one';
        }
        else if (trueValuesNum === 1) {
            const user = Object.keys(trueValues)[0];
            return `Accessible to only ${user}`;
        }
        else {
            const users = Object.keys(trueValues).join(', ');
            return `Accessible to ${users}`;
        }
    }
}
//# sourceMappingURL=api-endpoints-presenter.js.map