function Game(socket, leaderboard, drawing, viewPort) {
	this.socket = socket;

	this.leaderboard = leaderboard;
	this.drawing = drawing;
	this.viewPort = viewPort;

	this.self = null;

	this.players = [];

	this.latency = 0;

	this.animationFrameId = 0;
}

Game.create = function(socket, canvasElement, leaderboardElement) {
	canvasElement.width = Constants.CANVAS_WIDTH;
	canvasElement.height = Constants.CANVAS_HEIGHT;
	var canvasContext = canvasElement.getContext("2d");

	var leaderboard = Leaderboard.create(leaderboardElement);
	var drawing = Drawing.create(canvasContext);
	var viewPort = ViewPort.create();

	var game = new Game(socket, leaderboard, drawing, viewPort);
	game.init();
	return game;
};

Game.prototype.init = function() {
	this.socket.on(
		"update",
		bind(this, function(data) {
			this.receiveGameState(data);
		})
	);
};

Game.prototype.receiveGameState = function(state) {
	this.leaderboard.update(state["leaderboard"]);

	this.self = state["self"];
	this.players = state["players"];
	this.latency = state["latency"];
};

Game.prototype.animate = function() {
	this.animationFrameId = window.requestAnimationFrame(bind(this, this.run));
};

Game.prototype.stopAnimation = function() {
	window.cancelAnimationFrame(this.animationFrameId);
};

Game.prototype.run = function() {
	this.update();
	this.drawing();
	this.animate();
};

Game.prototype.update = function() {
	if (this.self) {
		this.viewPort.update(this.self["position"], this.self["position"]);

		var packet = {
			keyboardState: {
				up: Input.UP,
				right: Input.RIGHT,
				down: Input.DOWN,
				left: Input.Left
			},
			timestamp: new Date().getTime()
		};
		this.socket.emit("player-action", packet);
	}
};

Game.prototype.draw = function() {
	if (this.self) {
		this.drawing.clear();

		var center = this.viewPort.selfCoords;
		var leftX = this.self["position"][0] - Constants.CANVAS_WIDTH / 2;
		var topY = this.self["position"][1] - Constants.CANVAS_HEIGHT / 2;

		var drawStartX = Math.max(leftX - (leftX % Drawing.TILE_SIZE), Constants.WORLD_MIN);
		var drawStartY = Math.max(topY - (topY % Drawing.TILE_SIZE), Constants.WORLD_MIN);

		var drawEndX = Math.min(drawStartX + Constants.CANVAS_WIDTH + Drawing.TILE_SIZE, Constants.WORLD_MAX);
		var drawEndY = Math.min(drawStartY + Constants.CANVAS_HEIGHT + Drawing.TILE_SIZE, Constants.WORLD_MAX);
		this.drawing.drawTiles(
			this.viewPort.toCanvasX(drawStartX),
			this.viewPort.toCanvasY(drawStartY),
			this.viewPort.toCanvasX(drawEndX),
			this.viewPort.toCanvasY(drawEndY)
		);
		if (this.self) {
			this.drawing.drawTank(
				true,
				this.viewPort.toCanvasCoords(this.self),
				this.self["orientation"],
				this.self["turretAngle"],
				this.self["name"],
				this.self["health"],
				this.self["powerups"]["shield_powerup"]
			);
		}
		// Draw any other tanks.
		for (var i = 0; i < this.players.length; ++i) {
			this.drawing.drawTank(
				false,
				this.viewPort.toCanvasCoords(this.players[i]),
				this.players[i]["orientation"],
				this.players[i]["turretAngle"],
				this.players[i]["name"],
				this.players[i]["health"],
				this.players[i]["powerups"]["shield_powerup"]
			);
		}
	}
};
