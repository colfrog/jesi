var jModule = {
	"name": "modes",
	"description": "Channel mode echo",
	"permissions": {
		"hasServerInfo": true,
		"hasIRCWriter": true
	}
};

function modes(msgData) {
	var nick;
	if (msgData.tailWords.length == 2)
		nick = msgData.tailWords[1];
	else
		nick = msgData.nick;

	let user = serverInfo.users[nick];
	if (!user) {
		console.log('nick not found: ' + nick);
		console.log(user)
	}

	let chan = msgData.params[0];
	ircWriter.sendMessage(msgData.replyTarget, user.channels[chan]);
}

addCommand('modes', 'modes');
