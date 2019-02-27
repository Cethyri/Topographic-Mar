function Point(x, y) {
	this.x = x;
	this.y = y;
}

Point.createPoint = (x, y) => {
	return new Point(x, y);
};
/**
 * Returns a point of (-1, -1)
 */
Point.getDefaultPoint = function() {
	return new Point(-1, -1);
};
/**
 * Prints in (x, y)
 * format
 */
Point.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")";
};

module.exports = Point;
