import * as fs from 'fs';

export function compareApiEndpointsFiles(actualFile, expectedFile) {
  let apiEndpointsActualJSON = fs.readFileSync(actualFile, {encoding: 'utf8'});
  let apiEndpointsExpectedJSON = fs.readFileSync(expectedFile, {encoding: 'utf8'});

  apiEndpointsActualJSON = _removeVolatileApiEndpointsCollection(apiEndpointsActualJSON);
  apiEndpointsExpectedJSON = _removeVolatileApiEndpointsCollection(apiEndpointsExpectedJSON);

  //fs.writeFileSync('./tmp/api_endpoints_expected.json', apiEndpointsExpectedJSON, {encoding: 'utf8'});
  //fs.writeFileSync('./tmp/api_endpoints_actual.json', apiEndpointsActualJSON, {encoding: 'utf8'});

  expect(apiEndpointsActualJSON).toEqual(apiEndpointsExpectedJSON);
}

// These values change every time you run the crawler so lets not use them for comparison
function _removeVolatileApiEndpointsCollection(str) {
  str = str.replace(/_my_app_session=[a-z0-9]+;/g, '_my_app_session=<REMOVED>;');
  str = str.replace(/"etag": "(.)+"/g, '"etag": "<REMOVED>"');
  str = str.replace(/"x-runtime": "[0-9.]+"/g, '"x-runtime": "<REMOVED>"');
  str = str.replace(/"x-request-id": "[a-z0-9-]+"/g, '"x-request-id": "<REMOVED>"');
  str = str.replace(/"date": "[A-Za-z0-9-,:\s]+"/g, '"date": "<REMOVED>"');
  str = str.replace(/"cookie": "_my_app_session=[a-z0-9]+"/g, '"cookie": "_my_app_session=<REMOVED>"');
  str = str.replace(/"id": "[a-z0-9-]+"/g, '"id": "<REMOVED>"');
  str = str.replace(/"user-agent": "(.)+"/g, '"user-agent": "<REMOVED>"');
  str = str.trim();

  return str;
}

export function comparePagesFiles(actualFile, expectedFile) {
  let pagesActualJSON = fs.readFileSync(actualFile, {encoding: 'utf8'});
  let pagesExpectedJSON = fs.readFileSync(expectedFile, {encoding: 'utf8'});

  pagesActualJSON = _removeVolatilePageData(pagesActualJSON);
  pagesExpectedJSON = _removeVolatilePageData(pagesExpectedJSON);

  expect(pagesActualJSON).toEqual(pagesExpectedJSON);
}

function _removeVolatilePageData(str) {
  str = str.replace(/"id": "[a-z0-9-]+"/g, '"id": "<REMOVED>"');
  str = str.replace(/"createdAt": "[A-Z0-9-:.]+"/g, '"createdAt": "<REMOVED>"');
  str = str.trim();

  return str;
}

export function createTmpDir() {
  const dir = './tmp';

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}
