# request-light.js | A Light-Weight Http Request library for node.js

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

## Initialize Configure

Configure to initialize the library with global preferences of all your request by ```Request.config(configure);```.

```js
Request.config({
    debug: true,
    timeout: 6000,
    encoding: 'gb2312',
    host: 'google.com',
    method: 'GET',
    path: '/base-path/'
});
```

Configure to specify a single request by ```Request.post(remote-address).config(configure);```

```js
var url = 'http://google.com/';
Request.post(url)
    .query({
    	hello: 'world'
    })
    .config({
        timeout: 6000,
        encoding: 'gb2312',
        encodings: {
            request: 'gb2312',
            response: 'gb2312'
        }
    });
```

Configure retry when timeout globally. *(Only retry when timeout)*

```js
Request.config({
    debug: true,
    timeout: 6000,
    retry: true,            // Whether retry (only) when timeout.
    retryMaxTime: 3000,     // Retry timeout is 3000.
    retryMaxTimes: 5        // At most  5  request will be sent.
});
```


## Callback of request

```js
var callback = function(err, response){
    console.log(res.code);
    console.log(res.status);
    console.log(res.message);
    console.log(res.length);
    console.log(res.headers);
    console.log(res.body);
}
```


---

## Usage Sample

### Download binary file.

```js
Request.get( URL_BINARY_FILE )
    .config( {
        encoding: null  // set encoding as null to make the response body is instance of Buffer
    } )
    .done( function ( err, res ) {
        if ( err ) {return console.error( err );}
        fs.writeFile( FILE_DOWNLOADED, res.body, function ( err ) {
            if ( err ) {return console.error( err );}
            console.log( 'Saved file to: ' + FILE_DOWNLOADED );
        } )
    } );
```

---

## Update Log

- v0.8.6 *2016-11-23*
    - Added Support to handle multi-byte characters in the hard way. [ref][1]
    - Added response.length to represent the response body length.

---


[1]: https://nodejs.org/api/stream.html#stream_readable_setencoding_encoding "nodejs multi-byte characters solution."


