const jModule = {
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

addCommand('ping', 'pong');
