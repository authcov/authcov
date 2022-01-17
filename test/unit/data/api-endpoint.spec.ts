import ApiEndpoint from '../../../src/data/api-endpoint';
import Config from '../../../src/config/config';

describe('ApiEndpoint', () => {
  describe('#aclKey()', () => {
    let apiEndpoint;

    describe('multiple requests and responses', () => {
      beforeEach(() => {
        const data = {
          "id": "3865b026-6372-4e6f-a72a-7b70b46a693e",
          "url": "http://localhost/api/settings/one.json",
          "method": "GET",
          "requests": [
            {
              "id": "f01a1dd7-6b6f-4a5f-aa35-d75734d0135a",
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
              "id": "46bd24be-8261-43b3-99de-16e76fd24617",
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
              "id": "1931d15a-f36f-47ff-a216-f53413d228c5",
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
              "id": "76b4a43d-e1a0-47cc-a941-120e5c69f46b",
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
        const configArgs = {
          authorisationHeaders: ['authorization'],
          responseIsAuthorised: (status, headers, body) => { return (status == 200); }
        };
        const config = new Config(configArgs);
        apiEndpoint = new ApiEndpoint(data, config);
      });

      it('should return the aclKey', () => {
        expect(apiEndpoint.aclKey()).toMatchObject({
          "Public": false,
          "alice@authcov.io": true,
          "bob@authcov.io": true
        });
      });
    });

    describe('multiple requests and some responses missing', () => {
      beforeEach(() => {
        const data = {
          "id": "3865b026-6372-4e6f-a72a-7b70b46a693e",
          "url": "http://localhost/api/settings/one.json",
          "method": "GET",
          "requests": [
            {
              "id": "76b4a43d-e1a0-47cc-a941-120e5c69f46b",
              "user": "alice@authcov.io",
              "pageUrl": "http://localhost",
              "headers": { "cookie": "_my_app_session=043e8651acbf7481d7437f412fe7cc83" }
            },
            {
              "id": "1931d15a-f36f-47ff-a216-f53413d228c5",
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
              "id": "46bd24be-8261-43b3-99de-16e76fd24617",
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
        const configArgs = {
          authorisationHeaders: ['authorization'],
          responseIsAuthorised: (status, headers, body) => { return (status == 200); }
        };
        const config = new Config(configArgs);
        apiEndpoint = new ApiEndpoint(data, config);
      });

      it('should not include the incomplete request in the aclKey', () => {
        expect(apiEndpoint.aclKey()).toMatchObject({
          "Public": false,
          "bob@authcov.io": false
        });
      });
    });
  });
});
