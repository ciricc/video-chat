/* 
	*********************************************************
	*   Video live straming with chat                       *
	*   I am used nodeJs for char (socket.io -> WebSocket)  *
	*   And hls.js for live streaming HLS                   *
	*********************************************************

	Support: PC
	Auth: @ciricc
	Date-public: 20.08.2017
	License: MIT
	
*/

var express = require('express');
var path = require("path");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/public', express.static(__dirname + '/public'));


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var state = false;
var users = {},
	online = 0,
	names = {};

var for_everyone = function (callback) {
	for (id in users) {
		callback(users[id]);
	}
}

io.on('connection', function (user){
	users[user.id] = user;
	online += 1;
	
	for_everyone(function(usr){
		usr.emit("join", online);
	});

	user.on('chat send', function (msg) {
		for_everyone(function(usr){
			usr.emit('chat message', msg);
		});
	});

	user.on('disconnect', function (){
		delete users[user.id];
		
		if (names[user.name]) {
			
			for_everyone(function(usr){
				usr.emit("outUser", user.name);
			});

			delete names[user.name];
		}

		online -= 1;
		for_everyone(function(usr){
			usr.emit("out", online);
		});
	});
	user.on('check_name', function (name) {
		var isValid = (!names[name.name]);
		if (isValid) {
			user.name = name.name;
			names[name.name] = true;
			if (name.lastname.length > 0) {delete names[name.lastname];}
		}

		user.emit('name_change_result', {
			isValid: isValid,
			name: name.name
		});
	})
});

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});