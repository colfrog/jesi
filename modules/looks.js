var jModule = {
	"name": "looks",
	"description": "Look the other way, like you always do.",
	"permissions": {
		"hasServerInfo": true,
		"hasIRCWriter": true
	}
};

const subst = {
	'^': 'v',
	'v': '^',
	'V': '^',
	'>': '<',
	'<': '>',
};

function doLooks(msgData) {
	let text = msgData.tail;
	let match = text.match(/^(.)(.)(.)$/)
	if (match && subst[match[1]] && subst[match[3]]) {
		let response = subst[match[1]] + (subst[match[2]] || match[2]) + subst[match[3]];
		if (response !== text)
			ircWriter.sendMessage(msgData.replyTarget, response);
	}
}

addMatch(/^...$/, 'doLooks');
