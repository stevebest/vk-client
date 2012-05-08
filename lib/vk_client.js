// VK-CLIENT
// =========

// VK API is HTTP-based, so it's not a big surprise that we need
// `http` and `querystring` modules. Every call is required to be
// signed with MD5, so we use `crypto` module.
var http = require('http');
var querystring = require('querystring');
var crypto = require('crypto');

// VKAPI
// -----
//
// This class handles low-level details of forming the query string,
// signing it, and actually firing the HTTP request. 
var VKAPI = (function () {

  // Endpoint configuration, as specified in VK API docs.
  // We only accept JSON as response format.
  var HOSTNAME = 'api.vk.com';
  var PATH     = '/api.php';
  var VERSION  = '3.0';
  var FORMAT   = 'json';

  // ### Constructor
  //
  // `apiId` (sic!) should be your app identifier.
  // No, it's not my idea to call it `apiId` instead of `appId` -
  // it's in VK docs, and in the actual API.
  function VKAPI(apiId) {
    this.apiId = apiId;
  };

  // ### `GET` and `POST`
  //
  // VK API allows using both `GET` and `POST` methods.
  // We provide convenience method for them.

  VKAPI.prototype.get = function(method, params, apiSecret, cb) {
    this.request('GET', method, params, apiSecret, cb);
  };

  VKAPI.prototype.post = function(method, params, apiSecret, cb) {
    this.request('POST', method, params, apiSecret, cb);
  };

  // ### Performing the VK API call
  VKAPI.prototype.request = function(httpMethod, method, params, apiSecret, cb) {
    // Fill in required parameters.
    params['api_id'] = this.apiId;
    params['method'] = method;
    params['format'] = FORMAT;

    // Prepare HTTP request options.
    var options = {
      hostname: HOSTNAME,
      method:   httpMethod,
      path:     PATH + '?' + this.query(params, apiSecret)
    }

    // Construct a request object and set up handlers.
    //
    // We collect the response chunks into a big JSON string
    // and parse it into an actual object.
    var req = http.request(options, function (res) {
      var apiResponse = '';
      res.on('data', function (chunk) {
        apiResponse += chunk;
      });
      res.on('end', function () {
        cb(null, JSON.parse(apiResponse));
      });
    });

    // Pass HTTP-related errors directly to callback.
    req.on('error', cb);

    // Fire the HTTP request and hope for the best.
    req.end();
  };

  // Construct a signed query string from request parameters.
  VKAPI.prototype.query = function(params, apiSecret) {
    return querystring.stringify(params)
      + '&sig=' + this.sign(params, apiSecret);
  };

  // ### Signing the request
  VKAPI.prototype.sign = function(params, apiSecret) {
    // Compute the request signature as described in VK API documentation.
    //
    // Extract the keys of `params` object into an array,
    // and sort the keys of `params` object lexicographically.
    var a = [], key;
 
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        a.push(key);
      }
    }

    a.sort();

    // Compute the signature as MD5 of request parameters joined
    // together with a secret key.
    var md5sum = crypto.createHash('md5');
    for (key = 0; key < a.length; key++) {
      md5sum.update('' + a[key] + '=' + params[a[key]]);
    }
    md5sum.update(apiSecret);

    // Return a signature as a hex string of a MD5 hash.
    return md5sum.digest('hex');
  };

  return VKAPI;

})();

// VKClient
// --------
//
// This class allows for creating and configuring the client
// for the VK API. 
var VKClient = (function() {

  // ### Constructor.
  function VKClient() {
  };

  // ### Configuring VK API client identifier
  VKClient.prototype.apiId = function(apiId) {
    this._api = new VKAPI(apiId);
    return this;
  };

  // ### Configuring VK API secret key
  VKClient.prototype.apiSecret = function(secret) {
    // To set a secret only once and keep it private,
    // magically change this method into a getter,
    // which is a closure around the secret value.
    if (secret != null) {
      this.apiSecret = function() {
        return secret;
      }
      return this; // Allow chaining.
    }

    // API secret is not set yet, return `undefined`.
    return void 0;
  };

  // ### Calling the VK API
  VKClient.prototype.api = function(method, params, cb) {
    // Interrogate the API endpoint and passes a result to a callback.
    this._api.get(method, params, this.apiSecret(), cb);
  };

  return VKClient;

})();

// Export classes.
module.exports = {
  API: VKAPI,
  Client: VKClient
};
