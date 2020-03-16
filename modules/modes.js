function modes(msgData) {
	let nick = msgData.nick;
	let chan = msgData.params[0];
	ircWriter.sendMessage(msgData.params[0], serverInfo.users[nick].channels[chan]);
}

addCommand('modes', 'modes');
