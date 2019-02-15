//
var DEV_MODE = true;
var PORT = process.env.PORT || 5000;
var FRAME_RATE = 1000.0 / 60.0;

// Dependencies.
var bodyParser = require("body-parser");
var express = require("express");
var http = require("http");
var morgan = require("morgan");
var socketIO = require("socket.io");
var swig = require("swig");
var path = require("path");

var Game = require("./lib/Game");

//Initialization
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var game = new Game();

app.engine("html", swig.renderFile);

app.set("port", PORT);
app.set("view engine", "html");

app.use(morgan("dev"));
app.use("/public", express.static(__dirname + "/public"));
app.use("/shared", express.static(__dirname + "/shared"));

//Routing
app.get("/", function(request, response) {
	response.render("index.html", {
		dev_mode: DEV_MODE
	});
});

//Server side input handler
io.on("connection", function(socket) {
	//When a new player joins, server adds a new player to the game
	socket.on("new-player", function(data, callback) {
		game.addNewPlayer(data.name, socket);
		io.sockets.emit("chat-server-to-clients", {
			name: "[Tank Anarchy]",
			message: data.name + " has joined the game.",
			isNotification: true
		});
		callback();
		socket.emit("chat-server-to-clients", {
			name: "[Tank Anarchy]",
			message: "Welcome, " + data.name + "! Use WASD to move and click " + "to shoot. Pick up powerups to boost your tank temporarily!",
			isNotification: true
		});
	});

	//Update the internal object states every time a player sends an intent packet
	socket.on("player-action", function(data) {
		game.updatePlayer(socket.id, data.keyboardState, data.turretAngle, data.shot, data.timestamp);
	});

	//this looks like chat message
	socket.on("chat-client-to-server", function(data) {
		io.sockets.emit("chat-server-to-clients", {
			name: game.getPlayerNameBySocketId(socket.id),
			message: data
		});
	});

	//When a player disconnects, remove them from the game
	socket.on("disconnect", function() {
		var name = game.removePlayer(socket.id);
		io.sockets.emit("chat-server-to-clients", {
			name: "[Tank Anarchy]",
			message: name + " has left the game.",
			isNotification: true
		});
	});
});

//Server side game loop
setInterval(function() {
	game.update();
	game.sendState();
}, FRAME_RATE);

server.listen(PORT, function() {
	console.log("Starting server on port " + PORT);
	if (DEV_MODE) {
		console.log("DEVELOPMENT MODE ENABLED: SERVING UNCOMPILED JAVASCRIPT!");
	}
});
