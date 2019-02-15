function Util() {
	throw new Error("Util should not be instantiated!");
}

Util.truncate = function(x) {
	return x | 0;
};

Util.getSign = function(x) {
	if (x > 0) {
		return 1;
	} else if (x < 0) {
		return -1;
	} else {
		return 0;
	}
};
Util.getManhattanDistance = function(x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};
Util.getEuclideanDistance2 = function(x1, y1, x2, y2) {
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
};
Util.getEuclideanDistance = function(x1, y1, x2, y2) {
	return Math.sqrt(Util.getEuclideanDistance2(x1, y1, x2, y2));
};

Util.inBound = function(val, min, max) {
	if (min > max) {
		return val >= max && val <= min;
	}
	return val >= min && val <= max;
};

Util.bound = function(val, min, max) {
	if (min > max) {
		return Math.min(Math.max(val, max), min);
	}
	return Math.min(Math.max(val, min), max);
};

Util.randRange = function(min, max) {
	if (min >= max) {
		var swap = min;
		min = max;
		max = swap;
	}
	return Math.random() * (max - min) + min;
};

Util.randRangeInt = function(min, max) {
	if (min >= max) {
		var swap = min;
		min = max;
		max = swap;
	}
	return Math.floor(Math.random() * (max - min)) + min;
};

if (typeof module === "object") {
	/**
	 * If Util is loaded as a Node module, then this line is called.
	 */
	module.exports = Util;
} else {
	/**
	 * If Util is loaded into the browser, then this line is called.
	 */
	window.Util = Util;
}
