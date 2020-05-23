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
	'-': ['O', 'o'],
	'o': '-',
	'O': '-',
};

function eye(subst) {
	switch (typeof subst) {
	case 'string':
		return subst;
	case 'object':
		return subst[Math.floor(Math.random()*subst.length)];
	default:
		return 'o';
	}
}

function doLooks(msgData) {
	let text = msgData.tail;
	let match = text.match(/^(.)(.)(.)$/)
	if (match && subst[match[1]] && subst[match[3]]) {
		let s = []
		for (i = 1; i <= 3; i++)
			s.push(subst[match[i]]);

		let left_eye = eye(s[0]);
		let right_eye = eye(s[2]);
		let mouth = subst[match[2]] || match[2];
		let response = left_eye + mouth + right_eye;

		if (response !== text)
			ircWriter.sendMessage(msgData.replyTarget, response);
	}
}

addMatch(/^...$/, 'doLooks');
