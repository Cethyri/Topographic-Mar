function Chat(socket, displayElement, textElement) {
	this.socket = socket;

	this.displayElement = displayElement;
	this.textElement = textElement;
}

Chat.create = function(socket, displayElement, textElement) {
	var chat = new Chat(socket, displayElement, textElement);
	chat.init();
	return chat;
};

Chat.prototype.init = function() {
	this.textElement.addEventListener(
		"keydown",
		bind(this, function(e) {
			if (e.keyCode == 13) {
				this.sendMessage();
			}
		})
	);
	this.socket.on(
		"chat-server-to-clients",
		bind(this, function(data) {
			this.recieveMessage(data["name"], data["message"], data["isNotification"]);
		})
	);
};

Chat.prototype.recieveMessage = function(name, message, isNotification) {
	var element = document.createElement("li");
	if (isNotification) {
		element.setAttribute("class", "notification");
	}
	element.appendChild(document.createTextNode(name + ": " + message));
	this.displayElement.appendChild(element);
};

Chat.prototype.sendMessage = function() {
	var text = this.textElement.value;
	this.textElement.value = "";
	this.socket.emit("chat-client-to-server", text);
};
