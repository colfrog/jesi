function doIntensify(msgData) {
	let text = msgData.tail;
	let match = text.match(/^\[(.+)\]$/);
	if (match) {
		let response = '\x02\x0304[' + match[1].toUpperCase() + '\x0f\x02\x0304 INTENSIFIES]';
		ircWriter.sendMessage(msgData.replyTarget, response);
	}
}

addMatch(/^\[.+\]$/, 'doIntensify');
