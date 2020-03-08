function doNotice(msgData) {
	if (msgData.tailWords.length !== 2)
		return;

	const who = msgData.tailWords[1];
	const response = 'You are beautiful and you deserve to be loved.';
	ircWriter.sendNotice(who, response);
}

function doLeave(msgData) {
	if (msgData.tailWords.length !== 2)
		return;

	let channel = msgData.params[0];
	let who = msgData.tailWords[1];

	if (who.toLowerCase() === serverInfo.user.nick.toLowerCase()) {
		ircWriter.sendAction(channel, 'cries');
		ircWriter.partFrom(channel, ':(');
	} else {
		ircWriter.sendMessage(channel, 'I refuse!');
	}
}

function doBlam(msgData) {
	ircWriter.sendCommand('NICK', serverInfo.user.nick);
}

function doEcho(msgData) {
	let match = msgData.tail.match(/echo\s(.+)$/);
	let channel = msgData.params[0];
	if (match !== null)
		ircWriter.sendMessage(channel, match[1]);
}

function doAct(msgData) {
	let channel = msgData.params[0];
	ircWriter.sendAction(channel, 'acts');
}

addCommand('notice', 'doNotice');
addCommand('leave,', 'doLeave');
addCommand('blam', 'doBlam');
addCommand('echo', 'doEcho');
addCommand('act!', 'doAct');
