const { expect } = require('chai');
const fs = require('fs');

function compareApiEndpointsFiles(actualFile, expectedFile) {
  const apiEndpointsActualJSON = fs.readFileSync(actualFile, {encoding: 'utf8'});
  const apiEndpointsActual = JSON.parse(apiEndpointsActualJSON);

  const apiEndpointsExpectedJSON = fs.readFileSync(expectedFile, {encoding: 'utf8'});
  const apiEndpointsExpected = JSON.parse(apiEndpointsExpectedJSON);

  console.log(`Found actual - ${apiEndpointsActual.length}, expected - ${apiEndpointsExpected.length}`)

  apiEndpointsActual.forEach((apiEndpointActual) => {
    const apiEndpointExpected = apiEndpointsExpected.find((apiEndpoint) => {
      return (apiEndpoint.url == apiEndpointActual.url && apiEndpoint.method == apiEndpointActual.method);
    });

    if(apiEndpointExpected === undefined) {
      throw `Could not find apiEndpointExpected for request: ${apiEndpointActual.method} ${apiEndpointActual.url}`;
    }

    if(apiEndpointActual.requests.length != apiEndpointExpected.requests.length) {
      throw `Unequal request length: ${apiEndpointActual.method} ${apiEndpointActual.url}`;
    }

    expect(apiEndpointActual.requests.length).to.equal(apiEndpointExpected.requests.length);

    for(let i = 0; i < apiEndpointExpected.requests.length; i++) {
      const actualRequest = apiEndpointActual.requests[i];
      const expectedRequest = apiEndpointExpected.requests[i];

      expect(actualRequest.user).to.equal(expectedRequest.user);
      expect(actualRequest.pageUrl).to.equal(expectedRequest.pageUrl);
      expect(actualRequest.response.status).to.eql(expectedRequest.response.status);
      expect(actualRequest.response.authorised).to.eql(expectedRequest.response.authorised);
    }
  });
}

function comparePagesFiles(actualFile, expectedFile) {
  const pagesActualJSON = fs.readFileSync(actualFile, {encoding: 'utf8'});
  const pagesActual = JSON.parse(pagesActualJSON);

  const pagesExpectedJSON = fs.readFileSync(expectedFile, {encoding: 'utf8'});
  const pagesExpected = JSON.parse(pagesExpectedJSON);

  pagesActual.forEach((pageActual) => {
    const pageExpected = pagesExpected.find((page) => {
      return (page.pageUrl == pageActual.pageUrl && page.user == pageActual.user);
    });

    if(pageExpected === undefined) {
      throw `Could not find pageExpected for page: ${pageActual.pageUrl}`;
    }

    expect(pageExpected.dialogsOpened).to.eql(pageActual.dialogsOpened);
    expect(pageExpected.buttonsClicked).to.eql(pageActual.buttonsClicked);
    expect(pageExpected.buttonsIgnored).to.eql(pageActual.buttonsIgnored);
  });
}

module.exports = {
  compareApiEndpointsFiles: compareApiEndpointsFiles,
  comparePagesFiles: comparePagesFiles
}
