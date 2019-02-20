function Drawing(context, images) {
	this.context = context;

	this.images = images;
}

Drawing.NAME_FONT = "14px Helvetica";
Drawing.NAME_COLOR = "black";
Drawing.HP_COLOR = "green";
Drawing.BASE_IMG_URL = "/public/img/";

Drawing.IMG_SRCS = {
	self_tank: Drawing.BASE_IMG_URL + "self_tank.png",
	other_tank: Drawing.BASE_IMG_URL + "other_tank.png",
	tile: Drawing.BASE_IMG_URL + "tile.png"
};

Drawing.TILE_SIZE = 100;

Drawing.create = function(context) {
	var images = {};
	for (var key in Drawing.IMG_SRCS) {
		images[key] = new Image();
		images[key].src = Drawing.IMG_SRCS[key];
	}
	return new Drawing(context, images);
};

Drawing.prototype.clear = function() {
	this.context.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
};
