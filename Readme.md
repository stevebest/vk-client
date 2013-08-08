vk-client
=========

VK-Client is an implementation of _VK.com_ aka _ВКонтакте_ (_VKontakte_) API
for Node.

DEPRECATION NOTICE
------------------

This module was written as a quick and dirty hack and was never meant to be usable.
Frankly, it's quite stupid. Its API is ugly, it can't do Node streams and OAuth.

Even its name is kinda stupid.

For all intents and purposes, this module is dead.

Use https://github.com/stevebest/node-vkontakte instead. It's better, and I might
continue to develop it someday.

Installation
------------

No surprises here.

```
npm install vk-client
```

Running the test requires setting up `VK_API_ID` and `VK_API_SECRET`
environment variables. For example:

    $ make test VK_API_ID=your_api_id VK_API_SECRET=your_api_secret


Usage
-----

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
});
```

Author
------

Stepan Stolyarov <stepan.stolyarov@gmail.com>
