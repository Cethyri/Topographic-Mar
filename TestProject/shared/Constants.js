function Constants() {
	throw new Error("Constants should not be instantiated!");
}
Constants.WORLD_MIN = 0;

Constants.WORLD_MAX = 2500;

Constants.CANVAS_WIDTH = 800;
Constants.CANVAS_HEIGHT = 600;

Constants.VISIBILITY_THRESHOLD_X = Constants.CANVAS_WIDTH / 2;
Constants.VISIBILITY_THRESHOLD_Y = Constants.CANVAS_HEIGHT / 2;

if (typeof module === "object") {
	/**
	 * If Constants is loaded as a Node module, then this line is called.
	 */
	module.exports = Constants;
} else {
	/**
	 * If Constants is loaded into the browser, then this line is called.
	 */
	window.Constants = Constants;
}
