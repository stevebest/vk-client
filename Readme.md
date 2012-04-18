
vk-client
---------

VK-Client is an implementation of _VK.com_ aka _ВКонтакте_ (_VKontakte_) API for Node.

Installation
============

No surprises here.

```
npm install vk-client
```

Usage
=====

An example of calling `users.get` API method.

```javascript
var vk = require('vk-client');

var vkClient = new vk.Client();

vkClient.apiId('YOUR API ID').apiSecret('YOUR API SECRET KEY');

var params = {
  'uids'   : '1', // Look up Pavel Durov himself
  'fields' : 'uid,first_name,last_name,photo'
};

vkClient.api('users.get', params, function (err, result) {
  console.log(result);
  done();
});
```

Author
======

Stepan Stolyarov <stepan.stolyarov@gmail.com>
