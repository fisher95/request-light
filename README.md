# Light Http Request library

*Under Development Yet* :)

## Attention:

A light http request library for NodeJS, supporting 'gbk/gb2312' encoding.

*Why it is light, cause I do not believe that I can write something that are much complicated* :)

It is a simple library drifted by someone amateur like me and please do not use it in the product level.

## How to use:

```js
var Request = require('request');

Request
    .init({
        timeout: 6000,
        encoding: 'gb2312',
        host: 'google.com',
        method: 'GET',
        path: '/base-path/'
    });


Request
    //.get('remote-address')
    .post('remote-address')
    .config({
        timeout: 6000,
        encoding: 'gb2312',
        encoding: {
            request: 'gb2312',
            response: 'gb2312'
        }
    })
    .send({
        someKey: 'some-value'
    })
    .headers({
        'User-Agent': 'fisher95.com'
    })
    .done(function(err, res){
        if(err)
            return R.log(err);
        R.log(res.headers);
        R.log(res.body);
    });
```