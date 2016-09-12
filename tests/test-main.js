/**
 * Created by fisher on 9/12/16 at 11:57 PM.
 *
 * Test scripts for request-light module.
 */

var Request = require( '../request-light' );


Request.config({
	debug: false
});

Request.get('http://baidu.com/')
	.done( function ( err, res ) {
		if ( err )return console.error( err );
		console.log( res.headers );
		console.log( '----------' );
		console.log( res.body );
	} );





