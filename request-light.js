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
let basePreference = {
	options: {},
	headers: {
		'User-Agent': Constants.HEADER_USER_AGNENT_DEFAULT
	},
	encoding: Constants.ENCODING_DEFAULT,
	timeout: Constants.TIME_DEFAULT_TIMEOUT,
	retry: true, // Retry only when timeout.
	retryMaxTimes: 3,// Max retry times.
	retryMaxTime: 10000 // Retry timeout in milliseconds.
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
		let preference = extend(true, {}, basePreference);
		let address = url.parse(options.address);
		if ('http:' === address.protocol) {
			this.client = http;
		} else if ('https:' === address.protocol) {
			this.client = https;
		} else {
			throw 'unsupported protocol: ' + address.protocol;
		}
		preference.options.protocol = address.protocol;
		preference.options.host = address.host;
		preference.options.hostname = address.hostname;
		preference.options.port = address.port;
		preference.options.path = address.path;
		preference.headers['Host'] = preference.options.host;
		this.preference = preference;
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
		if (options) {extend(true, this.preference, options);}
		return this;
	}

	/**
	 * query some data
	 *
	 * @param data json data to be query
	 */
	query(data) {
		this.preference.query = data;
		data = queryString.stringify(data, null, null
			, {encodeURIComponent: Utils.getEncodeURIComponent(this.preference.encoding)});
		if (this.preference.options.path.indexOf('?') < 0) {
			this.preference.options.path += '?' + data;
		} else {
			// if endsWith('&')
			this.preference.options.path += '&' + data;
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
		if ('GET' === this.preference.options.method) {Utils.warning(Utils.strings.warning_send_body_using_get);}
		data = queryString.stringify(data, null, null
			, {encodeURIComponent: Utils.getEncodeURIComponent(this.preference.encoding)});
		this.preference.data = data;
		this.preference.contentLength = Buffer.byteLength(data);
		this.preference.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		this.preference.headers['Content-Length'] = this.preference.contentLength;
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
		extend(true, this.preference.headers, headers);
		return this;
	}

	/**
	 * Send request to fetch resources.
	 *
	 * @param callback function Callback function that will be called when encountered an error or the request is done
	 * @returns {Request} return this to call other function
	 */
	_sendRequest(callback) {
		let _this = this;
		let isRequestTimeout = false;
		// let isResponseTimeout = false;
		let req = _this.client.request({
			host: _this.preference.options.hostname,
			port: _this.preference.options.port,
			path: _this.preference.options.path,
			method: _this.preference.options.method,
			headers: _this.preference.headers,
			timeout: _this.preference.timeout
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
			res.setTimeout(_this.preference.timeout);
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
				if (_this.preference.encoding) {
					response.body = Utils.toUtf8FromEncoding(response.body, _this.preference.encoding);
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
			if (isRequestTimeout && err) {return callback(new Error(Constants.ERROR_CONNECTOIN_TIMEOUT));}
			callback(err);
		});
		if (_this.preference.data) {req.write(_this.preference.data);}
		req.end();
		Utils.log('-------- start of configure ---------');
		Utils.log(this.preference);
		Utils.log('--------  end of configure  ---------');
		return this;
	}

	done(callback) {
		if (!this.preference.retry) {
			return this._sendRequest(callback);
		}
		let _this = this;
		let retryDeadline = this.preference.retryMaxTime + (+new Date());
		let retryLeftTimes = this.preference.retryMaxTimes;

		let goForIt = function (err) {
			--retryLeftTimes;
			if (err) {
				Utils.log(`Retrying[${retryLeftTimes}] the resource.`);
			} else {
				Utils.log(`Trying[${retryLeftTimes}] the resource.`);
			}
			_this._sendRequest(retryIt);
		};
		let retryIt = function (err, response) {
			if (err && Constants.ERROR_CONNECTOIN_TIMEOUT === err.message) {
				if (0 === retryLeftTimes) {
					Utils.warning(`:>>> $ Stop retrying because retryMaxTimes was due. Failed [${_this.preference.retryMaxTimes}] times.`);
					return callback(err);
				}
				if (retryDeadline < (+new Date())) {
					Utils.warning(`:>>> $ Stop retrying because retryMaxTime was due. Failed [${_this.preference.retryMaxTimes - retryLeftTimes}] times.`);
					return callback(err);
				}
				return goForIt(err);
			}
			if (err) {return callback(err);}
			callback(null, response);
		};
		goForIt();
		return this;
	}

	end(callback) {
		return this.done(callback);
	}
}

Request.config = function (options) {
	if (!options) {return;}
	Utils.config(options);
	extend(true, basePreference, options);
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

