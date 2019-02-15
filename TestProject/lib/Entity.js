var Constants = require("../shared/Constants");
var Util = require("../shared/Util");

var add = require("vectors/add")(2);
var copy = require("vectors/copy")(2);
var div = require("vectors/div")(2);
var mult = require("vectors/mult")(2);

function Entity(position, velocity, acceleration, mass) {
	this.position = position || [0, 0];
	this.velocity = velocity || [0, 0];
	this.velocityDifference = [0, 0];
	this.acceleration = acceleration || [0, 0];
	this.accelerationDifference = [0, 0];

	this.mass = mass || 1;

	this.lastUpdateTime = 0;
	this.updateTimeDifference = 0;
}

Entity.prototype.isVisibleTo = function(player) {
	return (
		Util.inBound(this.getX(), player.getX() - Constants.VISIBILITY_THRESHOLD_X, player.getX() + Constants.VISIBILITY_THRESHOLD_X) &&
		Util.inBound(this.getY(), player.getY() - Constants.VISIBILITY_THRESHOLD_Y, player.getY() + Constants.VISIBILITY_THRESHOLD_Y)
	);
};

Entity.prototype.update = function() {
	var currentTime = new Date().getTime();
	if (this.lastUpdateTime == 0) {
		this.updateTimeDifference = 0;
	} else {
		this.updateTimeDifference = currentTime - this.lastUpdateTime;
	}
	this.velocityDifference = mult(copy(this.velocity), this.updateTimeDifference / 1000);
	add(this.position, this.velocityDifference);
	console.log(this.position, this.velocity);
	this.lastUpdateTime = currentTime;
};

Entity.prototype.applyForce = function(force) {
	add(this.acceleration, div(force, this.mass));
};

Entity.prototype.getX = function() {
	return this.position[0];
};
Entity.prototype.getY = function() {
	return this.position[1];
};
module.exports = Entity;
