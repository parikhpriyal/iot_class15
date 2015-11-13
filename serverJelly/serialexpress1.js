//global variables
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
var port = 8000;
var url='localhost'
var server = app.listen(port);
var io = require("socket.io").listen(server);
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
//information for arduino port
var sport = new SerialPort("/dev/ttyAMA0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
}, false); 
//initilize libraries for ultrasonic sensor reading
var statistics = require('math-statistics');
var usonic = require('r-pi-usonic');

app.use(express.static(__dirname + '/'));
console.log('Simple static server listening at '+url+':'+port);

app.get('', function (req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('YOUR SERVER IS RUNNING')

})

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
		    console.log('Serial open');


		    //initialize sensor library for reading
			usonic.init(function(err){
				var init = function(config) {
					//reading sensor
			    	var sensor = usonic.createSensor(config.echoPin, config.triggerPin, config.timeout);
			   		
		 			var distances;

		 			//calculating distance
			    	(function measure() {
			    		if (!distances || distances.length === config.rate) {
		            		if (distances) {
		            			print(distances);
		            		}
				          	distances = [];
				       	}
			 
			       		setTimeout(function() {
			       			distances.push(sensor());
		          			measure();
		          		}, config.delay);
			    	}());
			   	};
		 		
		 		// print distance and send data to arduino and website
		   		var print = function(distances) {
		    		var distance = statistics.median(distances);
				 
				    process.stdout.clearLine();
					process.stdout.cursorTo(0);
				 	
				 	//conditions for sending data
		    		if (distance < 0) {
		    			process.stdout.write('Error: Measurement timeout.\n');
				   	} else {
				   		//printing data to console
			     		process.stdout.write('Distance: ' + distance.toFixed(0) + ' cm');

			     		//sending data to arduino port
			     		sport.write(distance.toFixed(0)+" \n");

			     		//based on distance sending two different objects from database to website
			     		if(distance < 4){
			     			appParse.find('Jellyfish', 'fEKGMstIIL', function (err, response){
				     			console.log(response);
				     			socket.emit('toScreen', {ParseData: response});
			     			});
			     		}
			     		if(distance <= 7 && distance > 4){
			     			appParse.find('Jellyfish', 'OEx9cTSijj', function (err, response){
				     			console.log(response);
				     			socket.emit('toScreen', {ParseData: response});
			     			});
			     		}
		    		}
		    	};
		 		
		 		//initialize pins on the pi and variables for calculating distance
		    	init({
		        	echoPin: 18, //Echo pin
					triggerPin: 17, //Trigger pin
		        	timeout: 1000, //Measurement timeout in µs
		        	delay: 60, //Measurement delay in ms
		        	rate: 5 //Measurements per sample
		    	});	
			});		
		}
	});
});



