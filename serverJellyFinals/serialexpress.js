var PORT = 33333;
var HOST = '192.168.1.91';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var express = require("express");
var app = express();

var Parse = require('node-parse-api').Parse;
//keys for parse database
var APP_ID = "NQTmgQVMeKnnxTfIV3FDWjpiNdIN54aMwaQl3RBJ";
var MASTER_KEY = "Fwy6uhGE9Qq5utw1B6FOm2rqZwpyayWlAR2oqNQc";
//initialize parse database
var appParse = new Parse(APP_ID, MASTER_KEY);

var state = 0;

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
	// console.log(remote.address + ',' + remote.port +',' + message);	

  	var mes = remote.address + ',' + remote.port +',' + message;
  	var mes_array = mes.split(",");

  	for(var i = 0; i < mes_array.length; i++) {
   		mes_array[i] = mes_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
    }
   // console.log(mes_array[2]);
    if(mes_array[2] == 'a'){
    	console.log(mes_array[3]);
   		appParse.insert('News',{News: mes_array[3]}, function(err, response){
			console.log('entry made');
		});
    }
    if(mes_array[2] == 'b'){
    	console.log(mes_array[3]);
   			
    	if(state == 0){
	   		appParse.find('Jellyfish', 'OEx9cTSijj', function (err, response){

				console.log(response);

				var mess = new Buffer("OK, " + response.FDate + "," + response.Power + "," + response.Time + "," + response.Weather + "," + response.food + "," + response.news);

				server.send(mess, 0, mess.length, remote.port, remote.address, function(err, bytes){
					if (err){
						throw err;
					}
				});

				state = 1;
			});
		}	
		else if(state == 1){
			appParse.find('Jellyfish', 'fEKGMstIIL', function (err, response){

				console.log(response);

				var mess = new Buffer("OK, " + response.FDate + "," + response.Power + "," + response.Time + "," + response.Weather + "," + response.food + "," + response.news);

				server.send(mess, 0, mess.length, remote.port, remote.address, function(err, bytes){
					if (err){
						throw err;
					}
				});

				state = 0;
			});
		}
				
		appParse.find('News', '', function (err, response){

			console.log(response);
			var num=Object.keys(response.results).length;

			// console.log(num);

			var tosend = response.results[num-1]; 

			// console.log(tosend);

			var mes = new Buffer("HI, " + tosend.News);

			server.send(mes, 0, mes.length, remote.port, remote.address, function(err, bytes){
				if (err){
					throw err;
				}
			});
		});
	}
});

server.bind(PORT, HOST);