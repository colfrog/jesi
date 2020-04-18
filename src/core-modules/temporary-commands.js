var jModule = {
	"name": "Temporary Commands",
	"description": "Temporary commands for testing",
	"core": true
};

function doNotice(msgData) {
	if (msgData.tailWords.length < 2)
		return;

	const response = 'You are beautiful and you deserve to be loved.';
	let who = msgData.tailWords[1].toLowerCase();
	let chan = msgData.params[0];
	let nick = msgData.nick;
	switch (who) {
	case 'everyone':
		if (chan[0] === '#' && !serverInfo.users[nick].channels[chan].includes('o'))
			return;

		Object.keys(serverInfo.channels[chan].users).forEach(user => {
			ircWriter.sendNotice(user, response);
		});
		ircWriter.sendNotice(nick, 'Everyone was noticed.');
		break;

	case 'me':
		ircWriter.sendNotice(nick, response);
		break;

	default:
		ircWriter.sendNotice(who, response);
		ircWriter.sendNotice(nick, who + ' was noticed.');
		break;
	}
}

// please join #gnulag
function doPlease(msgData) {
	if (msgData.tailWords.length < 3)
		return;

	let channels = msgData.tailWords.slice(2).join().split(',');

	switch (msgData.tailWords[1].toLowerCase()) {
	case 'join':
		channels = channels.join(',');
		ircWriter.sendCommand('JOIN', channels);

		break;

	case 'leave':
		channels.forEach(channel =>
			ircWriter.sendCommand('PART', channel)
		);

		break;

	default:
		return;
	}
}

function doLeave(msgData) {
	ircWriter.sendAction(msgData.replyTarget, 'cries');
	ircWriter.partFrom(channel, 'why does ' + msgData.nick + ' hate me :(');
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
	let who = msgData.nick;
	if (match !== null)
		ircWriter.sendMessage(msgData.replyTarget, who + ': ' + match[1]);
}

function doAct(msgData) {
	ircWriter.sendMessage(msgData.replyTarget, 'They say the neon lights are bright, on Broadway!');
	ircWriter.sendAction(msgData.replyTarget, 'does a Broadway dance');
}

addCommand('notice', 'doNotice');
addCommand('please,', 'doPlease');
addCommand('please', 'doPlease');
addCommand('leave,', 'doLeave');
addCommand('blam', 'doBlam');
addCommand('echo', 'doEcho');
addCommand('act!', 'doAct');