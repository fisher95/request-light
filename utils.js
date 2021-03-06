/**
 * Created by fisher on 8/21/16 at 6:36 PM.
 *
 * Scripts to initialize this library
 */

'use strict';

const urlEncode = require('urlencode');
const Iconv = require("iconv-lite");
const queryString = require('querystring');
const Constants = require('./constants');

let debug = false;

/**
 * Configure the log level
 * @param cfg {Object} options
 * @param cfg.debug {Boolean} debug mode or not
 */
exports.config = function (cfg) {
	if ('debug' in cfg) {debug = cfg.debug;}
};

exports.log = function (data) {
	if (debug) {console.log(data);}
	return data;
};
exports.warning = function (data) {
	if (debug) {console.warn(data);}
	return data;
};

/**
 * decode url
 *
 * @param data      encoded data.
 * @param encoding  encoding to be used.
 * @return string   decoded string
 */
exports.urlEncode = urlEncode.encode;
/**
 * encode url
 *
 * @param data      to be encoded data.
 * @param encoding  encoding to be used.
 * @return string   encoded string
 */
exports.urlDecode = urlEncode.decode;

/**
 * Convert buffer to utf8 string from encoding
 *
 * @param buffer    the buffer data.
 * @param encoding  the origin encoding
 * @returns string  the utf8 encoded string
 */
exports.toUtf8FromEncoding = function (buffer, encoding) {
	return Iconv.decode(buffer, encoding).toString();
};

exports.strings = {
	warning_send_body_using_get: 'Warning: It seems that you are using http GET to send data :('
};

exports.gbkEncodeURIComponent = function (origin) {
	if (new RegExp(/[^\x00-\xff]/g).test(origin)) {
		return ( Utils.urlEncode(origin, Constants.ENCODING_GB2312) );
	}
	return queryString.escape(origin);
};
/**
 * Get Corresponding encoding component.
 * @param encoding{String} Encoding.
 */
exports.getEncodeURIComponent = function (encoding) {
	switch (encoding) {
		case exports.ENCODING_GB2312:
		case exports.ENCODING_GBK:
			return exports.gbkEncodeURIComponent;
	}
};
