var jModule = {
	"name": "intensify",
	"description": "Intensify the conversation",
	"permissions": {
		"hasIRCWriter": true
	}
};

function doIntensify(msgData) {
	let text = msgData.tail;
	let match = text.match(/^\[(.+)\]$/);
	if (match) {
		let response = '\x02\x0304[\x1d' + match[1].toUpperCase() + '\x0f\x02\x0304 \x1dINTENSIFIES\x1d]';
		ircWriter.sendMessage(msgData.replyTarget, response);
	}
}

addMatch(/^\[.+\]$/, 'doIntensify');
