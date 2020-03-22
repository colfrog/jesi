const subst = {
	'b': 'd',
	'd': 'b',
	'p': 'q',
	'q': 'p',
	'^': 'v',
	'v': '^',
	'V': '^',
	'>': '<',
	'<': '>',
	'w': 'm',
	'm': 'w',
	'M': 'W',
	'W': 'M',
	'n': 'u',
	'u': 'n',
	'e': "\x02\x58",
	"\x02\x58":  'e'
};

function doLooks(msgData) {
	let text = msgData.tail;
	let match = text.match(/^(.)(.)(.)$/)
	if (match && subst[match[1]] && subst[match[3]]) {
		let response = subst[match[1]] + (subst[match[2]] || match[2]) + subst[match[3]];
		ircWriter.sendMessage(msgData.params[0], response);
	}
}

addMatch(/^...$/, 'doLooks');
