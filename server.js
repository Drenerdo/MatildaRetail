var http   	   = require('http');
var static 	   = require('node-static');
var url    	   = require('url');
var rq     	   = require('request');
var path   	   = require('path');
var google 	   = require('googleapis');
var googleapis = require('google-auth-library');
var fs 		   = require('fs');
var express    = require('express');

var app = express();

var config = require("envy").load(__dirname + '/node.config.json');


var file = new static.Server('./');

function onRequest(request, response) {
	console.log("Request recevied");
	var pathname = url.parse(request.url).pathname;
	console.log("Pathname: "+pathname);

	if(pathname === "/proxy") {
		var query = url.parse(request.url, true).query;
		if(query.url !== undefined) {
			rq.get(request.url, function(error, res, body){
				if(!error && res.statusCode == 200) {
					response.writeHead(200, {"Access-Control-Allow-Origin": "*"});
					response.end(body);
					console.log("Proxied => " + query.url);
				}
				else {
					console.log(error);
				}
			});
		}
		else {
			console("/proxy missing url parameter");
		}
	}
	else {
		file.serve(request, response);
	}
	console.log("Response ended");
}

http.createServer(onRequest).listen(config.port);
console.log(process.env.NODE_ENV + " server has started at port" + config.port + ".");
