function pong(msgData) {
	ircWriter.sendMessage(msgData.replyTarget, commandPrefix + 'pong');
}

addCommand('ping', 'pong');
