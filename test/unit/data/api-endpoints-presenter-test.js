const { expect } = require('chai');
const fs = require('fs');
const ApiEndpointData = require('../../../src/data/api-endpoint-data.js');
const ApiEndpointsPresenter = require('../../../src/data/api-endpoints-presenter.js');

describe('ApiEndpointsPresenter', () => {
  /*
  describe('#groupedApiEndpoints()', () => {
    beforeEach(() => {
      const config = {
        users: [
          {username: 'Public', password: null},
          {username: 'evanrolfe@onescan.io', password: 'Password1'},
          {username: 'evanrolfe@gmail.com', password: 'Password2'}
        ],
        authorisationHeaders: ['authorization'],
        responseIsAuthorised: (response, body) => { return (response.status == 200); }
      }
      const data = new ApiEndpointData({config: config});
      data.loadFile('./test/unit/fixtures/api_endpoints_for_presenter.json');
      this.presenter = new ApiEndpointsPresenter(data.apiEndpoints);
      this.groupedEndpoints = this.presenter.groupedApiEndpoints();
    });

    it('should return the api endpoints accessible to everybody', () => {
      const aclKey = '{"alice@authcov.io":true,"Public":true,"bob@authcov.io":true}';
      const endpoints = this.groupedEndpoints[aclKey];

      expect(endpoints.map(endpoint => endpoint.url)).to.eql([
        'http://localhost/api/settings/one.json',
        'http://localhost/api/posts.json',
        'http://localhost/api/posts/2.json',
        'http://localhost/api/posts/3.json',
        'http://localhost/api/posts/4.json'
      ]);
    });
    it('should return the api endpoints accessible to alice and bob', () => {
      const aclKey = '{"alice@authcov.io":true,"Public":false,"bob@authcov.io":true}';
      const endpoints = this.groupedEndpoints[aclKey];

      expect(endpoints.map(endpoint => endpoint.url)).to.eql([
        'http://localhost/api/secrets.json',
        'http://localhost/api/posts/1.json'
      ]);
    });

    it('should return the api endpoints accessible to only alice', () => {
      const aclKey = '{"alice@authcov.io":true,"Public":false,"bob@authcov.io":false}';
      const endpoints = this.groupedEndpoints[aclKey];

      expect(endpoints.map(endpoint => endpoint.url)).to.eql([
        'http://localhost/api/secrets/1.json'
      ]);
    });
  });
  */

  describe('#_aclTitle()', () => {
    beforeEach(() => {
      this.presenter = new ApiEndpointsPresenter([]);
    });

    it('should return the title when accessible to everybody', () => {
      const aclKeyString = '{"alice@authcov.io":true,"Public":true,"bob@authcov.io":true}';
      expect(this.presenter._aclTitle(aclKeyString)).to.equal('Accessible to everyone');
    });

    it('should return the title when accessible to alice and bob', () => {
      const aclKeyString = '{"alice@authcov.io":true,"Public":false,"bob@authcov.io":true}';
      expect(this.presenter._aclTitle(aclKeyString)).to.equal('Accessible to alice@authcov.io, bob@authcov.io');
    });

    it('should return the title when accessible to only alice', () => {
      const aclKeyString = '{"alice@authcov.io":true,"Public":false,"bob@authcov.io":false}';
      expect(this.presenter._aclTitle(aclKeyString)).to.equal('Accessible to only alice@authcov.io');
    });
  });
});
