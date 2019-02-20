function AFK_Kicker() {}

AFK_Kicker.KICK_TIME = 120000;

AFK_Kicker.init = function() {
	AFK_Kicker.TIMER = new Date().getTime();
	window.addEventListener("click", AFK_Kicker.resetTimer);
	window.addEventListener("mousemove", AFK_Kicker.resetTimer);
	window.addEventListener("keydown", AFK_Kicker.resetTimer);
	window.addEventListener("keyup", AFK_Kicker.resetTimer);
};

AFK_Kicker.check = function() {
	if (new Date().getTime() > AFK_Kicker.TIMER + AFK_Kicker.KICK_TIME) {
		location.reload();
	}
};

AFK_Kicker.resetTimer = function() {
	AFK_Kicker.TIMER = new Date().getTime();
};
