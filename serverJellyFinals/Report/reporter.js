//global variables
var PORT = 33333;
var HOST = '192.168.1.91'; //change to servers ip address
var dgram = require('dgram');
var message;
var bool = 0;

var client = dgram.createSocket('udp4');
var clientName="";

//initializing parse
var Parse = require('node-parse-api').Parse;
//keys for parse database
var APP_ID = "NQTmgQVMeKnnxTfIV3FDWjpiNdIN54aMwaQl3RBJ";
var MASTER_KEY = "Fwy6uhGE9Qq5utw1B6FOm2rqZwpyayWlAR2oqNQc";
//initialize parse database
var appParse = new Parse(APP_ID, MASTER_KEY);
//initialize bodyparser
var bodyParser = require('body-parser');
//initalize expess for running server
var express = require("express");
var app = express();
//information for server address
var sport = 3000;
var url='localhost'
var sserver = app.listen(sport);
var io = require("socket.io").listen(sserver);
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

app.use(express.static(__dirname + '/'));
console.log('Simple static server listening at '+url+':'+sport);

app.get('', function (req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('YOUR SERVER IS RUNNING')

});

io.sockets.on('connection', function (socket) {
	//check if socket works to ensure emitting data
	console.log("socket on");

	socket.on('sendToMain', function(data){
		message = 'a,' + data.news;
		console.log (message);
   		client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
           if (err) throw err;
           console.log('UDP message sent to ' + HOST +':'+ PORT); 
        });
	});
	
});