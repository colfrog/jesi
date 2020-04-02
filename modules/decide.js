function doDecide(msgData) {
	let who = msgData.nick;
	let choice = Math.random < 0.5 ? 'yes' : 'no';
	ircWriter.sendMessage(msgData.replyTarget, who + ': ' + choice + '.');
}

addCommand('decide', 'doDecide');
