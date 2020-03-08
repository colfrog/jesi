function pong(msgData) {
	ircWriter.sendMessage(msgData.params[0], commandPrefix + 'pong');
}

addCommand('ping', 'pong');
