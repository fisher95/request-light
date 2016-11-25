/**
 * Created by fisher on 8/21/16 at 6:21 PM.
 *
 * Request-Light
 *
 * A light Http request library that 'gbk' is compatible
 */
'use strict';

const http = require('http');
const https = require('https');
const extend = require('extend');
const url = require('url');
const queryString = require('querystring');
const Utils = require('./utils');
const Constants = require('./constants');

/**
 * Base request configure.
 */
let baseConfigure = {
	headers: {
		'User-Agent': Constants.HEADER_USER_AGNENT_DEFAULT
	},
	encoding: Constants.ENCODING_DEFAULT,
	timeout: Constants.TIME_DEFAULT_TIMEOUT
};

class Request {
	/**
	 * Initialize a specific http request
	 *
	 * @param options necessary info to be specified
	 * @param options.address http request adress
	 * @param options.method http request method. [ 'GET' | 'POST' ]
	 */
	constructor(options) {
		/**
		 * Options about this request
		 * @type {{options: {method: ('GET'|'POST'|'DELETE')}, headers: {}, data: string, timeout: number, contentLength: number, encoding: string}}
		 */
		let configure = {
			options: {
				method: options.method || 'GET'
			},
			headers: extend({}, baseConfigure.headers),
			data: '',
			timeout: baseConfigure.timeout,
			contentLength: 0,
			encoding: baseConfigure.encoding
		};
		let address = url.parse(options.address);
		if ('http:' === address.protocol) {
			this.client = http;
		} else if ('https:' === address.protocol) {
			this.client = https;
		} else {
			throw 'unsupported protocol: ' + address.protocol;
		}
		configure.options.protocol = address.protocol;
		configure.options.host = address.host;
		configure.options.hostname = address.hostname;
		configure.options.port = address.port;
		configure.options.path = address.path;
		configure.headers['Host'] = configure.options.host;
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
	config(options) {
		if (options) {extend(true, this.configure, options);}
		return this;
	}

	/**
	 * query some data
	 *
	 * @param data json data to be query
	 */
	query(data) {
		this.configure.query = data;
		data = queryString.stringify(data, null, null
			, {encodeURIComponent: Utils.getEncodeURIComponent(this.configure.encoding)});
		if (this.configure.options.path.indexOf('?') < 0) {
			this.configure.options.path += '?' + data;
		} else {
			// if endsWith('&')
			this.configure.options.path += '&' + data;
		}
		return this;
	}

	/**
	 * Send data to server; Now using url-encoded.
	 *
	 *      TODO support others
	 *
	 * @param data json data to be send
	 * @returns {Request} return this to call other methods
	 */
	send(data) {
		if ('GET' === this.configure.options.method) {Utils.warning(Utils.strings.warning_send_body_using_get);}
		data = queryString.stringify(data, null, null
			, {encodeURIComponent: Utils.getEncodeURIComponent(this.configure.encoding)});
		this.configure.data = data;
		this.configure.contentLength = Buffer.byteLength(data);
		this.configure.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		this.configure.headers['Content-Length'] = this.configure.contentLength;
		return this;
	}

	/**
	 * send the specific headers
	 *
	 * @param headers{Object} headers to be specified
	 * @returns {Request}
	 */
	headers(headers) {
		if (!headers) {return;}
		extend(true, this.configure.headers, headers);
		return this;
	}

	/**
	 * The callback
	 *
	 * @param callback function Callback function that will be called when encountered an error or the request is done
	 * @returns {Request} return this to call other function
	 */
	done(callback) {
		let _this = this;
		let isRequestTimeout = false;
		let isResponseTimeout = false;
		let req = _this.client.request({
			host: _this.configure.options.hostname,
			port: _this.configure.options.port,
			path: _this.configure.options.path,
			method: _this.configure.options.method,
			headers: _this.configure.headers,
			timeout: _this.configure.timeout
		});
		req.on('response', function (res) {
			let response = {
				code: res.statusCode,
				status: res.statusCode,
				message: res.statusMessage,
				length: 0,
				headers: res.headers,
				body: ''
			};
			res.setTimeout(_this.configure.timeout);
			// res.setTimeout(1, function () { // It did not work.
			// isResponseTimeout = true;
			// 	console.error('timeoutttttttttttttttttttttttttt');
			// 	callback('timeouttttttttttttttttttttttttttttttt');
			// });
			res.on('error', function (err) {
				callback(err);
			});
			res.on('data', function (part) {
				// Get all the data before convert it to desired encoding.
				// This could be destroyable when fetching large resource(>>20MB).
				if (response.body) {
					response.body = Buffer.concat([response.body, part]);
					Utils.log(`Got some response[${part.length}].`);
				} else {
					response.body = part;
					Utils.log(`Got response[${part.length}] from server.`);
				}
			});
			res.on('end', function () {
				Utils.log(`All together got response[${response.body.length}].`);
				Utils.log('-------- start of response ---------');
				response.length = response.body.length;
				if (_this.configure.encoding) {
					response.body = Utils.toUtf8FromEncoding(response.body, _this.configure.encoding);
				}
				Utils.log(response);
				Utils.log('--------  end of response  ---------');
				callback(null, response);
			});
		});
		req.on('timeout', function () {
			isRequestTimeout = true;
			req.abort();
		});
		req.on('error', function (err) {
			if (isRequestTimeout && err) {return callback(['request timeout :( ', err]);}
			callback(err);
		});
		if (_this.configure.data) {req.write(_this.configure.data);}
		req.end();
		Utils.log('-------- start of configure ---------');
		Utils.log(this.configure);
		Utils.log('--------  end of configure  ---------');
		return this;
	}

	end(callback) {
		return this.done(callback);
	}
}

Request.config = function (options) {
	if (!options) {return;}
	Utils.config(options);
	extend(true, baseConfigure, options);
};

/**
 * Supported encodings.
 */
Request.ENCODINGS = Constants.ENCODINGS;


/**
 * start a new post request
 *
 * @param address url address
 * @returns {Request} return a new post request object to request the remote resources
 */
Request.post = function (address) {
	return new Request({
		address: address,
		method: 'POST'
	});
};
/**
 * start a new get request
 *
 * @param address url address
 * @returns {Request} return a new get request object to request the remote resources
 */
Request.get = function (address) {
	return new Request({
		address: address,
		method: 'GET'
	});
};
// export class Request
module.exports = Request;

