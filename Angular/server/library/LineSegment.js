var Point = require("./Point");

function LineSegment(left, right) {
	this.left = left;
	this.right = right;
}

LineSegment.createBothEnds = (left, right) => {
	return new LineSegment(left, right);
};

LineSegment.createSinglePoint = center => {
	return new LineSegment(center, center);
};

LineSegment.createDefault = function() {
	var def = Point.getDefaultPoint();

	return new LineSegment(def, def);
};

LineSegment.prototype.toString = function() {
	return this.left.toString() + ", " + this.right.toString();
};

module.exports = LineSegment;
