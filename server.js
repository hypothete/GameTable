var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(8123));
console.log('Listening on port 8123');

var allClients = [];

io.sockets.on('connection', function (socket) {
	allClients.push(socket);
	var i = allClients.indexOf(socket);
	socket.on('send', function (data) {

		if(data !== null && data.id && data.data){
			i = allClients.indexOf(socket);
			allClients[i].gameId = data.id;
			io.sockets.emit('message', data);
		}
	});

	socket.on('disconnect', function() {
		console.log('disconnect!');
		var i = allClients.indexOf(socket);
		io.sockets.emit('removeClient', allClients[i].gameId);
      	allClients.splice(i, 1);
		
	});
	
});