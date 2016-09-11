# request-light | A Light Http Request library for node.js

*Under Development Yet* :)

A Light Http Request library for node.js. (Supporting gbk encoding. :)

## References

Other http request library for node.js.

https://github.com/request/request

https://github.com/Mashape/unirest-nodejs


## Attention:

A light http request library for NodeJS, supporting 'gbk/gb2312' encoding.

*Why it is light, cause I do not believe that I can write something that are much complicated* :)

It is a simple library drifted by someone amateur like me and please do not use it in the product level.

---

## Get-Started

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
        encoding: 'gb2312'
    })
    .headers({
        'User-Agent': 'fisher95.com'
    })
    .send({
        someKey: 'some-value'
    })
    .done(function(err, res){
        if(err)
            return R.log(err);
        R.log(res.headers);
        R.log(res.body);
    });
```

---

## Init Configure

Configure to initialize the library with global preferences of all your request by ```Request.config(configure);```.

```js
{
    debug: true,
    timeout: 6000,
    encoding: 'gb2312',
    host: 'google.com',
    method: 'GET',
    path: '/base-path/'
}
```

## Request Configure

Configure to specify a single request by ```Request.post(remote-address).config(configure);```

```js
{
    timeout: 6000,
    encoding: 'gb2312',
    encodings: {
        request: 'gb2312',
        response: 'gb2312'
    }
}
```


## Callback of request

```js
function(err, response){
    console.log(res.headers);
    console.log(res.body);
}
```


---
