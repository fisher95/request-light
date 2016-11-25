/**
 * Created by fisher on 9/12/16 at 11:57 PM.
 *
 * Test scripts for request-light module.
 */

var Request = require('../request-light');
var fs = require('fs');
var URL_BINARY_FILE = 'http://jwc.ecust.edu.cn/_upload/article/files/5c/97/3529bbd543a9bdf6bd4428445663/161a211e-d747-4599-aafe-ccd959c16b05.doc';
var FILE_DOWNLOADED = 'baf63b15-87ac-4ce1-a6f2-04e6c3ea4425.xls';
var URL_SIMPLE_HTTPS = 'https://www.baidu.com/';
var URL_SIMPLE_HTTP = 'http://lovecust.com:30123/hello';
var URL_ECUST_JWC = 'http://jwc.ecust.edu.cn/';

Request.config({
	debug: false,
	timeout: 1000,
	headers: {
		'Fine': 'Okay'
	}
});

setTimeout(function () {
	simpleHTTP();
	ecustJwc();
	downloadFile();
	simpleHttps();
});

/**
 * Simple http request.
 */
var simpleHTTP = function () {
	Request.get(URL_SIMPLE_HTTP)
		.headers({
			'Whatever': 'xxxxxxxxxxxxxxxxxxxxx'
		})
		.query({
			myFavouriteColour: 'purple'
		})
		.done(function (err, res) {
			if (err) {return console.error(err);}
			console.log(res);
			console.log(res.body);
		});
};

/**
 * Fetch ecust jwc homepage.
 */
var ecustJwc = function () {
	Request.get(URL_ECUST_JWC)
		.done(function (err, res) {
			if (err) {return console.error(err);}
			console.log(res);
			console.log(res.body);
		});
};

/**
 * Download binary file.
 */
var downloadFile = function () {
	Request.get(URL_BINARY_FILE)
		.config({
			encoding: null  // set encoding as null to make the response body is instance of Buffer
		})
		.done(function (err, res) {
			if (err) {return console.error(err);}
			fs.writeFile(FILE_DOWNLOADED, res.body, function (err) {
				if (err) {return console.error(err);}
				console.log('Saved file to: ' + FILE_DOWNLOADED);
			})
		});
};

var simpleHttps = function () {
	Request.config({
		debug: true
	});
	Request.get(URL_SIMPLE_HTTPS)
		.done(function (err, res) {
			if (err) {return console.error(err);}
			console.log(res);
		});
};
