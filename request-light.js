/**
 * Created by fisher on 8/21/16 at 6:21 PM.
 *
 * Request-Light
 *
 * A light Http request library that 'gbk' is compatible
 */
'use strict';

const http = require( 'http' );
const url = require( 'url' );
const queryString = require( 'querystring' );
var Utils = require( './request-utils' );

class Request {
	/**
	 * Initialize a specific http request
	 *
	 * @param options necessary info to be specified
	 * @param options.address http request adress
	 * @param options.method http request method. [ 'GET' | 'POST' ]
	 */
	constructor( options ) {
		/**
		 * Options about this request
		 * @type {{options: {method: ('GET'|'POST'|'DELETE')}, headers: {}, data: string, timeout: number, contentLength: number, encoding: string, encodeURIComponent: null}}
		 */
		var configure = {
			options: {
				method: options.method || 'GET'
			},
			headers: {},
			data: '',
			timeout: 6000,
			contentLength: 0,
			encoding: 'utf8',
			// to encode form data
			encodeURIComponent: null
		};
		var address = url.parse( options.address );
		configure.options.host = address.host;
		configure.options.hostname = address.hostname;
		configure.options.port = address.port;
		configure.options.path = address.path;
		this.configure = configure;
	}

	/**
	 * configure this request
	 *
	 * @param options options to be specified
	 * @param options.timeout request timeout in micro-seconds; larger than 0;
	 * @param options.encoding request encoding: [ 'utf8' | 'gbk' | 'gb2312' ].
	 * @returns {Request} return this to call other methods.
	 */
	config( options ) {
		if (options.timeout)
			this.configure.timeout = options.timeout;
		if (options.encoding) {
			this.configure.encoding = options.encoding;
			if ('gb2312' === options.encoding || 'gbk' === options.encoding)
				this.configure.encodeURIComponent = Request.EncodeURIComponent.gbkEncodeURIComponent;
		}
		return this;
	}

	/**
	 * query some data
	 *
	 * @param data json data to be query
	 */
	query( data ) {
		this.configure.query = data;
		data = queryString.stringify( data, null, null
			, { encodeURIComponent: this.configure.encodeURIComponent } );
		if (this.configure.options.path.indexOf( '?' ) < 0)
			this.configure.options.path += '?' + data;
		else // if endsWith('&')
			this.configure.options.path += '&' + data;
		return this;
	}

	/**
	 * Send data to server; Now using url-encoded // TODO support others
	 *
	 * @param data json data to be send
	 * @returns {Request} return this to call other methods
	 */
	send( data ) {
		if ('GET' === this.configure.options.method)
			Utils.warning( Utils.strings.warning_send_body_using_get );
		data = queryString.stringify( data, null, null
			, { encodeURIComponent: this.configure.encodeURIComponent } );
		this.configure.data = data;
		this.configure.contentLength = Buffer.byteLength( data );
		this.configure.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded';
		this.configure.headers[ 'Content-Length' ] = this.configure.contentLength;
		return this;
	}

	/**
	 * send the specific headers
	 *
	 * @param headers json headers to be specified
	 * @returns {Request}
	 */
	headers( headers ) {
		this.configure.headers = headers;
		if (this.configure.contentLength) {
			this.configure.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded';
			this.configure.headers[ 'Content-Length' ] = this.configure.contentLength;
		}
		this.configure.headers[ 'Host' ] = this.configure.options.host;
		return this;
	}

	/**
	 * The callback
	 *
	 * @param callback function Callback function that will be called when encountered an error or the request is done
	 * @returns {Request} return this to call other function
	 */
	done( callback ) {
		var _this = this;
		var req = http.request( {
			host: this.configure.options.hostname,
			port: this.configure.options.port,
			path: this.configure.options.path,
			method: this.configure.options.method,
			headers: this.configure.headers
		}, function ( res ) {
			var response = {
				code: res.code,
				headers: res.headers,
				body: ''
			};
			res.setTimeout( _this.configure.timeout );
			res.on( 'error', function ( err ) {
				callback( err );
			} );
			res.on( 'data', function ( part ) {
				response.body += Utils.toUtf8FromEncoding( part, _this.configure.encoding );
			} );
			res.on( 'end', function () {
				Utils.log( '-------- start of response ---------' );
				Utils.log( response );
				Utils.log( '--------  end of response  ---------' );
				callback( null, response );
			} );
		} );
		if (this.configure.data)
			req.write( this.configure.data );
		req.end();
		Utils.log( '-------- start of configure ---------' );
		Utils.log( this.configure );
		Utils.log( '--------  end of configure  ---------' );
		return this;
	}
}
/**
 * Base http header
 */
Request.sHeaders = {
	'User-Agent': 'Mozilla/5.0 (Linux;) Chrome'
};

Request.config = function ( options ) {
	if (!options)
		return;
	Utils.config( options );
	if (options.headers)
		Request.sHeaders = options.headers;
	// TODO merge object
};
/**
 * supported encodings
 *
 * @type {string[]} array stores supported encodings in lowercase string
 */
Request.Encodings = [
	'utf8', 'gb2312'
];
/**
 * form data encoding methods
 *
 * @type gbkEncodeURIComponent: to encode chinese using encoding: gb2312
 */
Request.EncodeURIComponent = {
	gbkEncodeURIComponent: function ( origin ) {
		var encoding = 'gb2312';
		if (new RegExp( /[^\x00-\xff]/g ).test( origin ))
			return ( Utils.urlEncode( origin, encoding ) );
		return ( queryString.escape( origin ) );
	}
};
/**
 * start a new post request
 *
 * @param address url address
 * @returns {Request} return a new post request object to request the remote resources
 */
Request.post = function ( address ) {
	return new Request( {
		address: address,
		method: 'POST'
	} );
};
/**
 * start a new get request
 *
 * @param address url address
 * @returns {Request} return a new get request object to request the remote resources
 */
Request.get = function ( address ) {
	return new Request( {
		address: address,
		method: 'GET'
	} );
};
// export class Request
module.exports = Request;

