var Entity = require("./Entity");

var Util = require("../shared/Util");

function Player(position, orientation, name, id) {
	this.position = position;
	this.velocity = [0, 0];
	this.acceleration = [0, 0];

	this.orientation = orientation;
	this.name = name;
	this.id = id;

	this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE;
	this.turnRate = 0;
	this.health = Player.MAX_HEALTH;

	this.hitboxSize = Player.DEFAULT_HITBOX_SIZE;

	this.kills = 0;
	this.deaths = 0;
}
require("../shared/base");
Player.inheritsFrom(Entity);

Player.TURN_RATE = 0.005;
Player.DEFAULT_VELOCITY_MAGNITUDE = 300;
Player.DEFAULT_HITBOX_SIZE = 20;
Player.MAX_HEALTH = 10;
Player.MINIMUM_RESPAWN_BUFFER = 1000;

Player.generateNewPlayer = function(name, id) {
	var point = World.getRandomPoint();
	var orientation = Util.randRange(0, 2 * Math.PI);
	return new Player(point, orientation, name, id);
};

Player.prototype.updateOnInput = function(keyboardState) {
	if (keyboardState.up) {
		this.velocity = [this.vmag * Math.sin(this.orientation), -this.vmag * Math.cos(this.orientation)];
	}
	if (keyboardState.down) {
		this.velocity = [this.vmag * -Math.sin(this.orientation), -this.vmag * Math.cos(this.orientation)];
	}
	if (!keyboardState.up && !keyboardState.down) {
		this.velocity = [0, 0];
	}
	if (keyboardState.right) {
		this.turnRate = Player.TURN_RATE;
	}
	if (keyboardState.left) {
		this.turnRate = -Player.TURN_RATE;
	}
	if (!keyboardState.right && !keyboardState.left) {
		this.turnRate = 0;
	}
};

Player.prototype.update = function() {
	this.parent.update.call(this);
	this.orientation += this.turnRate * this.updateTimeDifference;

	var boundedPosition = World.bound(this.getX(), this.getY());
	this.position = boundedPosition;
};

Player.prototype.isCollidedWith = function(x, y, hitboxSize) {
	var minDistance = this.hitboxSize + hitboxSize;
	return Util.getEuclideanDistance2(this.getX(), this.getY(), x, y) < minDistance * minDistance;
};

Player.prototype.isDead = function() {
	return this.health <= 0;
};

Player.prototype.damage = function(amount) {
	this.health -= amount;
};
Player.prototype.respawn = function(players) {
	this.position = World.getRandomPoint();
	this.health = Player.MAX_HEALTH;
	this.deaths++;
};

module.exports = Player;
