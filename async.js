var im = require('imagemagick-native');
var fs = require('fs');
var pasta = './imagens';
var path = require('path');
var async = require('async');
var PORT = 8080;
var express = require('express');
var app = express();

function asynConvert(image, options, callback) {

	return async.waterfall([
    function(cb) {
    	fs.readFile(image, cb);
    },
    function(data, cb) {
    	options.srcData = data
	    var img = im.convert(options);
      callback(null, img);
    },
    function(err, arg1, cb) {
      callback(err, arg1);
    }
	], function (err, result) {
	   console.log(err, result)
	});

}

app.get('/', function(req, res) {

	var filename = path.join(pasta, 'heineken.jpg');

	asynConvert(filename, {
		width : 100,
		height : 100,
		resizeStyle : 'aspectfill',
		quality : 100,
		format : 'JPEG'
	}, function(img) {;
		res.setHeader('Content-Type', 'image/jpeg');
		res.send(img);
	})

});

app.listen(PORT);

console.log('Server on localhost:' + PORT);

