/**
 * Created by fisher on 9/12/16 at 11:57 PM.
 *
 * Test scripts for request-light module.
 */

var Request = require('../request-light');
var fs = require('fs');
var URL_BINARY_FILE = 'http://jwc.ecust.edu.cn/picture/article/75/6f/f6/0315a85a49b7bac2fef1cb45744d/baf63b15-87ac-4ce1-a6f2-04e6c3ea4425.xls';
var FILE_DOWNLOADED = 'baf63b15-87ac-4ce1-a6f2-04e6c3ea4425.xls';
var URL_SIMPLE_HTTPS = 'https://www.baidu.com/';
var URL_SIMPLE_HTTP = 'http://jwc.ecust.edu.cn/';

Request.config({
	debug: false
});

setTimeout(function () {
	simpleHTTP();
	// downloadFile();
	// simpleHttps();
});

var simpleHTTP = function () {
	Request.get(URL_SIMPLE_HTTP)
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
