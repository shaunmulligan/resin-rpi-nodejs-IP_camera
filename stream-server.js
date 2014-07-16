//setup for tty.js
var tty = require('tty.js');
var appTTY = tty.createServer({
  shell: 'bash',
  users: {
    admin: 'admin'
  },
  port: process.env.PORT
});
console.log("please work");
appTTY.listen();

if( process.argv.length < 2 ) {
	console.log(
		'Usage: \n' +
		'node stream-server.js [<stream-port> <websocket-port>]'
	);
	process.exit();
}

var STREAM_SECRET = process.env.STREAM_SECRET,
	STREAM_PORT = 8082;//process.argv[2] || 8082,
	WEBSOCKET_PORT = 8084;// process.argv[3] || 8084,
	STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

var width = 320,
	height = 240;

var express         = require('express');
var app             = express();
var server = require('http').createServer(app);
var ngrok = require('ngrok');

// this will make Express serve your static files
app.use(express.static(__dirname + '/public'));

ngrok.connect({
    authtoken: process.env.NGROK_AUTH_TOKEN,
    subdomain: 'rpiip',
    port: WEBSOCKET_PORT
}, function (err, url) {
    // https://rpiip.ngrok.com -> 127.0.0.1:8084 with http auth required
    console.log(err, url)
});
server.listen(WEBSOCKET_PORT);

// Websocket Server
var socketServer = new (require('ws').Server)({server: server});
socketServer.on('connection', function(socket) {
	// Send magic bytes and video size to the newly connected socket
	// struct { char magic[4]; unsigned short width, height;}
	var streamHeader = new Buffer(8);
	streamHeader.write(STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(width, 4);
	streamHeader.writeUInt16BE(height, 6);
	socket.send(streamHeader, {binary:true});

	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );

	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
	});
});

socketServer.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		this.clients[i].send(data, opts);
	}
};

// HTTP Server to accept incomming MPEG Stream
var streamServer = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');
	width = (params[1] || 320)|0;
	height = (params[2] || 240)|0;

	if( params[0] == STREAM_SECRET ) {
		console.log(
			'Stream Connected: ' + request.socket.remoteAddress +
			':' + request.socket.remotePort + ' size: ' + width + 'x' + height
		);
		request.on('data', function(data){
			socketServer.broadcast(data, {binary:true});
		});
	}
	else {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress +
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}
}).listen(STREAM_PORT);

//Start MPEG stream server
// var spawn = require('child_process').spawn;
// spawn('avconv -s 320x240 -f video4linux2 -i /dev/video0 -f mpeg1video -b 800k -r 30 http://127.0.0.1:'+STREAM_PORT+'/'+STREAM_SECRET+'/320/240/',[''],
// 			{
// 			    detached: true,
// 			    stdio: [ 'ignore', 'ignore', 'ignore' ]
// 			}
// 			);

console.log('Listening for MPEG Stream on http://127.0.0.1:'+STREAM_PORT+'/<secret>/<width>/<height>');
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');


