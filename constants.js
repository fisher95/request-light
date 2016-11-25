/**
 * Created by fisher at 3:13 PM on 11/25/16.
 *
 * Constant fields of request-light.js.
 */

'use strict';


/**
 * Encodings.
 */
exports.ENCODING_UTF8 = 'utf8';
exports.ENCODING_GB2312 = 'gb2312';
exports.ENCODING_GBK = 'gbk';
/**
 * Default encoding of both response and request.
 */
exports.ENCODING_DEFAULT = exports.ENCODING_UTF8;


/**
 * supported encodings
 *
 * @type {string[]} array stores supported encodings in lowercase string
 */
exports.ENCODINGS = [
	exports.ENCODING_UTF8,
	exports.ENCODING_GB2312
];

/**
 * Default timeout of requeest and response is 6 seconds.
 * @type {number} Time in milliseconds.
 */
exports.TIME_DEFAULT_TIMEOUT = 6000;

/**
 * Header name.
 */
exports.HEADER_USER_AGNENT = 'User-Agent';

/**
 * Default user-agent of request header.
 */
exports.HEADER_USER_AGNENT_DEFAULT = 'Mozilla/5.0 (Linux) Chrome';

/**
 * Connection timeout.
 */
exports.ERROR_CONNECTOIN_TIMEOUT = 'ETIMEDOUT';

