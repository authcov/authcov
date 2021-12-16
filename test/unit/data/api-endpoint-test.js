const { expect } = require('chai');
const ApiEndpoint = require('../../../dist/data/api-endpoint.js');

describe('ApiEndpoint', () => {
  describe('#aclKey()', () => {
    context('multiple requests and responses', () => {
      beforeEach(() => {
        const data = {
          "id": "3865b026-6372-4e6f-a72a-7b70b46a693e",
          "url": "http://localhost/api/settings/one.json",
          "method": "GET",
          "requests": [
            {
              "user": "alice@authcov.io",
              "pageUrl": "http://localhost",
              "headers": { "cookie": "_my_app_session=043e8651acbf7481d7437f412fe7cc83" },
              "response": {
                "status": 401,
                "headers": { "server": "nginx/1.17.2" },
                "authorised": false
              }
            },
            {
              "user": "alice@authcov.io",
              "pageUrl": "http://localhost/",
              "headers": { "cookie": "_my_app_session=043e8651acbf7481d7437f412fe7cc83" },
              "response": {
                "status": 200,
                "headers": { "server": "nginx/1.17.2" },
                "authorised": true
              }
            },
            {
              "user": "Public",
              "pageUrl": null,
              "headers": {},
              "response": {
                "status": 401,
                "headers": { "server": "nginx/1.17.2" },
                "authorised": false
              }
            },
            {
              "user": "bob@authcov.io",
              "pageUrl": null,
              "headers": { "cookie": "_my_app_session=58923fc42032801394204e96f9621f87" },
              "response": {
                "status": 200,
                "headers": { "server": "nginx/1.17.2" },
                "authorised": true
              }
            }
          ]
        };
        const config = {
          authorisationHeaders: ['authorization'],
          responseIsAuthorised: (status, headers, body) => { return (status == 200); }
        };
        this.apiEndpoint = new ApiEndpoint(data, config);
      });

      it('should return the aclKey', () => {
        expect(this.apiEndpoint.aclKey()).to.eql({
          "Public": false,
          "alice@authcov.io": true,
          "bob@authcov.io": true
        });
      });
    });

    context('multiple requests and some responses missing', () => {
      beforeEach(() => {
        const data = {
          "id": "3865b026-6372-4e6f-a72a-7b70b46a693e",
          "url": "http://localhost/api/settings/one.json",
          "method": "GET",
          "requests": [
            {
              "user": "alice@authcov.io",
              "pageUrl": "http://localhost",
              "headers": { "cookie": "_my_app_session=043e8651acbf7481d7437f412fe7cc83" }
            },
            {
              "user": "Public",
              "pageUrl": null,
              "headers": {},
              "response": {
                "status": 401,
                "headers": { "server": "nginx/1.17.2" },
                "authorised": false
              }
            },
            {
              "user": "bob@authcov.io",
              "pageUrl": null,
              "headers": { "cookie": "_my_app_session=58923fc42032801394204e96f9621f87" },
              "response": {
                "status": 401,
                "headers": { "server": "nginx/1.17.2" },
                "authorised": false
              }
            }
          ]
        };
        const config = {
          authorisationHeaders: ['authorization'],
          responseIsAuthorised: (status, headers, body) => { return (status == 200); }
        };
        this.apiEndpoint = new ApiEndpoint(data, config);
      });

      it('should not include the incomplete request in the aclKey', () => {
        expect(this.apiEndpoint.aclKey()).to.eql({
          "Public": false,
          "bob@authcov.io": false
        });
      });
    });
  });
});
