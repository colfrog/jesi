var jModule = {
	"name": "modes",
	"description": "Channel mode echo",
	"permissions": {
		"hasServerInfo": true,
		"hasIRCWriter": true
	}
};

function modes(msgData) {
	let nick = msgData.nick;
	let chan = msgData.params[0];
	ircWriter.sendMessage(msgData.replyTarget, serverInfo.users[nick].channels[chan]);
}

addCommand('modes', 'modes');
