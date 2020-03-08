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

var blamLocked = false;
function doBlam(msgData) {
	let nick = '';
	if (msgData.tailWords.length > 1)
		nick = msgData.tailWords[1]
	else
		nick = serverInfo.user.nick;

	if (nick !== serverInfo.user.nick && msgData.host === 'nuxi.ca') {
		switch (nick) {
		case 'lock':
			blamLocked = true;
			ircWriter.sendNotice(msgData.nick, 'Blam locked.');
			break;
		case 'unlock':
			blamLocked = false;
			ircWriter.sendNotice(msgData.nick, 'Blam unlocked.');
			break;
		default:
			if (!blamLocked)
				ircWriter.sendCommand('NICK', nick);
		}
	}
}

function doEcho(msgData) {
	let match = msgData.tail.match(/echo\s(.+)$/);
	let channel = msgData.params[0];
	if (match !== null && match[1][0] !== '!')
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
