var jModule = {
	"name": "pingpong",
	"description": "Play ping pong!",
	"permissions": {
		"hasServerInfo": true,
		"hasIRCWriter": true
	}
};

function pong(msgData) {
	ircWriter.sendMessage(msgData.replyTarget, commandPrefix + 'pong');
}

function ping(msgData) {
	ircWriter.sendMessage(msgData.replyTarget, commandPrefix + 'ping');
}

addCommand('ping', 'pong');
addCommand('pong', 'ping');
