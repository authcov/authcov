const { expect } = require('chai');
const ApiEndpoint = require('../../../lib/data/api-endpoint.js');

describe('ApiEndpoint', () => {
  describe('#aclKey()', () => {
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
      const webAppConfig = {
        users: [
          {username: 'Public', password: null},
          {username: 'evanrolfe@onescan.io', password: 'Password1'},
          {username: 'evanrolfe@gmail.com', password: 'Password2'}
        ],
        authorisationHeaders: ['authorization'],
        responseIsAuthorised: (response, body) => { return (response.status == 200); }
      };
      this.apiEndpoint = new ApiEndpoint(data, webAppConfig);
    });

    it('should return the aclKey', () => {
      expect(this.apiEndpoint.aclKey()).to.eql({
        "Public": false,
        "alice@authcov.io": true,
        "bob@authcov.io": true
      });
    });
  });
});
