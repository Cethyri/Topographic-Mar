var HashMap = require("hashmap");

var Player = require("./Player");

var Constants = require("../shared/Constants");
var Util = require("../shared/Util");

function Game() {
	this.clients = new HashMap();
	this.players = new HashMap();
}

Game.prototype.addNewPlayer = function(name, socket) {
	this.clients.set(socket.id, {
		socket: socket,
		latency: 0
	});
	this.players.set(socket.id, Player.generateNewPlayer(name, socket.id));
};

Game.prototype.removePlayer = function(id) {
	if (this.clients.has(id)) {
		this.clients.remove(id);
	}
	var player = {};
	if (this.players.get(id)) {
		player = this.players.get(id);

		this.players.remove(id);
	}
	return player.name;
};

Game.prototype.getPlayerNameBySocketId = function(id) {
	var player = this.players.get(id);
	if (player) {
		return player.name;
	}
	return null;
};

Game.prototype.updatePlayer = function(id, keyboardState, timestamp) {
	var player = this.players.get(id);
	var client = this.clients.get(id);
	if (player) {
		player.updateOnInput(keyboardState);
	}
	if (client) {
		client.latency = new Date().getTime() - timestamp;
	}
};
Game.prototype.getPlayers = function() {
	return this.players.values();
};
//Update the states of all the objects in the world
Game.prototype.update = function() {
	var players = this.getPlayers();
	for (let i = 0; i < players.length; ++i) {
		players[i].update();
	}
};

//Send the state of the game to all the connected sockets after filtering the appropriately
Game.prototype.sendState = function() {
	var leaderboard = this.players
		.values()
		.map(function(player) {
			return {
				name: player.name,
				kills: player.kills,
				deaths: player.deaths
			};
		})
		.sort(function(a, b) {
			return b.kills - a.kills;
		})
		.slice(0, 10);

	var ids = this.clients.keys();
	for (let i = 0; i < ids.length; ++i) {
		var currentPlayer = this.players.get(ids[i]);
		var currentClient = this.clients.get(ids[i]);
		currentClient.socket.emit("update", {
			leaderboard: leaderboard,
			self: currentPlayer,
			players: this.players.values().filter(function(player) {
				if (player.id == currentPlayer.id) {
					return false;
				}
				return player.isVisibleTo(currentPlayer);
			}),
			latency: currentClient.latency
		});
	}
};

module.exports = Game;
