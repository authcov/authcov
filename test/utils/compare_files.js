const { expect } = require('chai');
const fs = require('fs');

function compareApiEndpointsFiles(actualFile, expectedFile) {
  let apiEndpointsActualJSON = fs.readFileSync(actualFile, {encoding: 'utf8'});
  let apiEndpointsExpectedJSON = fs.readFileSync(expectedFile, {encoding: 'utf8'});

  apiEndpointsActualJSON = _removeVolatileApiEndpointData(apiEndpointsActualJSON);
  apiEndpointsExpectedJSON = _removeVolatileApiEndpointData(apiEndpointsExpectedJSON);

  expect(apiEndpointsActualJSON).to.equal(apiEndpointsExpectedJSON);
}

// These values change every time you run the crawler so lets not use them for comparison
function _removeVolatileApiEndpointData(str) {
  str = str.replace(/_my_app_session=[a-z0-9]+;/g, '_my_app_session=<REMOVED>;');
  str = str.replace(/"etag": "(.)+"/g, '"etag": "<REMOVED>"');
  str = str.replace(/"x-runtime": "[0-9.]+"/g, '"x-runtime": "<REMOVED>"');
  str = str.replace(/"x-request-id": "[a-z0-9-]+"/g, '"x-request-id": "<REMOVED>"');
  str = str.replace(/"date": "[A-Za-z0-9-,:\s]+"/g, '"date": "<REMOVED>"');
  str = str.replace(/"cookie": "_my_app_session=[a-z0-9]+"/g, '"cookie": "_my_app_session=<REMOVED>"');
  str = str.replace(/"id": "[a-z0-9-]+"/g, '"id": "<REMOVED>"');
  str = str.trim();

  return str;
}

function comparePagesFiles(actualFile, expectedFile) {
  let pagesActualJSON = fs.readFileSync(actualFile, {encoding: 'utf8'});
  let pagesExpectedJSON = fs.readFileSync(expectedFile, {encoding: 'utf8'});

  pagesActualJSON = _removeVolatilePageData(pagesActualJSON);
  pagesExpectedJSON = _removeVolatilePageData(pagesExpectedJSON);

  expect(pagesActualJSON).to.equal(pagesExpectedJSON);
}

function _removeVolatilePageData(str) {
  str = str.replace(/"id": "[a-z0-9-]+"/g, '"id": "<REMOVED>"');
  str = str.replace(/"createdAt": "[A-Z0-9-:.]+"/g, '"createdAt": "<REMOVED>"');
  str = str.trim();

  return str;
}

module.exports = {
  compareApiEndpointsFiles: compareApiEndpointsFiles,
  comparePagesFiles: comparePagesFiles
}
