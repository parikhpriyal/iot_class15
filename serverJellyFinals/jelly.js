//global variables
var PORT = 33333;
var HOST = '192.168.1.91';

var dgram = require('dgram');
var prompt = require('prompt');
prompt.start();
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
var eport = 8000;
var url='localhost'
var eserver = app.listen(eport);
var io = require("socket.io").listen(eserver);
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
//information for arduino port
var sport = new SerialPort("/dev/ttyAMA0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
}, false); 
//initilize LED
var GPIO = require('onoff').Gpio,
    led = new GPIO(17, 'out');


app.use(express.static(__dirname + '/'));
console.log('Simple static server listening at '+url+':'+eport);

app.get('', function (req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('YOUR SERVER IS RUNNING')

});


//initialize socket
io.sockets.on('connection', function (socket) {
	//check if socket works to ensure emitting data
	console.log("socket on");
	sport.open(function(error) {

	  	if (error) {
	  		//check for errors
	    	console.log('failed to open: ' + error);
	  	} else {
	  		//check if serialport for rfduino works
	  		sport.write("C");

		    console.log('Serial open');

		    sport.on('data', function(data){
		    	// console.log("Serial incoming: " + data);
		    	process.stdout.write('Serial incoming: ' + data);
		    	sport.write("C");

		    	if(data > 855){
		    		message = 'b, send';
		    		console.log (message);
   					client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
           				if (err) throw err;
           				console.log('UDP message sent to ' + HOST +':'+ PORT); 
        			});

        			client.on('message', function(message, remote){
						// console.log("Received from server: " + message);

						var mes = message.toString();

						var mes_array = mes.split(",");

						for(var i = 0; i < mes_array.length; i++) {
		   					mes_array[i] = mes_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		    			}


						console.log(mes_array[0]);
   						// socket.emit('toScreen', {info: mes});

   						if(mes_array[0] == 'HI'){
   							socket.emit('toLowerScreen', {info: mes});
   						}

   						if(mes_array[0] == 'OK'){
   							socket.emit('toScreen', {info: mes});
   						}
   					});

   			// 		client.on('message', function(message, remote){
						// // console.log("Received from server: " + message);

						// var mes = message.toString();
						// // console.log(mes);
   			// // 			socket.emit('LowerScreen', {info: mes});
   			// 		});
        		}
        	});

		    socket.on('ToServo', function (data){
		    	console.log(data);

		    	if(data.answer == 'Yes'){
		    		sport.write("A");
		    		console.log("Message to servo");
		    	}	
		    });
		}
	});
});



