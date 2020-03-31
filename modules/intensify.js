function doIntensify(msgData) {
	let text = msgData.tail;
	let chan = msgData.params[0];
	let match = text.match(/^\[(.+)\]$/);
	if (match) {
		let response = '\x02[' + match[1].toUpperCase() + '\x0f\x02 INTENSIFIES]';
		ircWriter.sendMessage(chan, response);
	}
}

addMatch(/^\[.+\]$/, 'doIntensify');
