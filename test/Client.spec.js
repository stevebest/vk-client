// Client
// ======

var assert = require('assert');
var config = require('./config');

var vk = require('..')

describe('vk.Client', function () {

  describe('.api(method, params, cb)', function () {

    var vkClient = new vk.Client();

    vkClient
      .apiId(config['VK_API_ID'])
      .apiSecret(config['VK_API_SECRET']);

    it('allows calling any API method', function (done) {
      var params = {
        'uids'   : '1', // Look up Pavel Durov himself
        'fields' : 'uid,first_name,last_name,photo'
      };

      vkClient.api('users.get', params, function (err, response) {
        assert.ifError(err);
        assert.ok(response);
        done();
      });
    });

    it('returns an error when API returns error-like object', function (done) {
      vkClient.api('no.such.method', {}, function (err, response) {
        assert.ok(err);
        done();
      });
    });

  });

});
