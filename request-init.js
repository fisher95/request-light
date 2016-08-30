/**
 * Created by fisher on 8/21/16 at 6:36 PM.
 *
 * Scripts to initialize this library
 */

// H means Helper here.
var H = global.H;
H.debug = false;
var urlencode = require( 'urlencode' );
var Iconv = require( "iconv-lite" );


H.log = function ( data ) {
	if (H.debug)
		console.log( data );
	return data;
};
H.warning = function ( data ) {
	console.warn( data );
	return data;
};

/**
 * decode url
 *
 * @param data      encoded data.
 * @param encoding  encoding to be used.
 * @return string   decoded string
 */
H.urlEncode = urlencode.encode;
/**
 * encode url
 *
 * @param data      to be encoded data.
 * @param encoding  encoding to be used.
 * @return string   encoded string
 */
H.urlDecode = urlencode.decode;

/**
 * Convert buffer to utf8 string from encoding
 *
 * @param buffer    the buffer data.
 * @param encoding  the origin encoding
 * @returns string  the utf8 encoded string
 */
H.toUtf8FromEncoding = function ( buffer, encoding ) {
	return Iconv.decode( buffer, encoding ).toString();
};

H.strings = {
	warning_send_body_using_get: 'Warning: It seems that you are using http GET to send data :('
};
