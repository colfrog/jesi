function doDecide(msgData) {
	let who = msgData.nick;
	let chan = msgData.params[0];
	let choice = Math.random < 0.5 ? 'yes' : 'no';
	ircWriter.sendMessage(chan, who + ': ' + choice + '.');
}

addCommand('decide', 'doDecide');
