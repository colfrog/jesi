function pong() {
	ircWriter.sendMessage(msgData.params[0], commandPrefix + 'pong');
}

addCommand('ping', 'pong()');
