function doIntensify(msgData) {
	let text = msgData.tail;
	let match = text.match(/^\[(.+)\]$/);
	if (match) {
		let response = '\x02[' + match[1].toUpperCase() + '\x0f\x02 INTENSIFIES]';
		ircWriter.sendMessage(msgData.replyTarget, response);
	}
}

addMatch(/^\[.+\]$/, 'doIntensify');
