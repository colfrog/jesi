var jModule = {
	"name": "replace",
	"description": "Replacing something makes it true!",
	"permissions": {
		"hasIRCWriter": true,
		"hasLogAccess": true
	}
};

// Don't ask me how this works, I've forgotten long ago.
const replacePattern = /^\%?s\/(?:(.*?)(?<!\\)\/(.*?)(?<!\\)(?:\/(.*))?)$/;
const simpleReplacePattern = /^\%?s\/.*\/.*\/?.*/;

function doReplace(msgData) {
	let match = msgData.tail.match(replacePattern);
	if (match === null)
		return;

	let regex = new RegExp(match[1], match[3]);
	let replace = match[2];

	getLogs(msgData.params[0], 100, (err, rows) => {
		if (err)
			return;

		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];
			if (row.message.match(simpleReplacePattern) === null && row.message.match(regex) !== null) {
				let text = row.message.replace(regex, '\x02' + replace + '\x02');
				let nickfmt = '';
				if (row.is_action)
					nickfmt = '\x02' + row.nick + '\x02 *';
				else
					nickfmt = '<\x02' + row.nick + '\x02>';

				ircWriter.sendMessage(msgData.replyTarget,
					'(' + msgData.nick + ')' +
					' ' + nickfmt +
					' ' + text
				);

				return;
			}
		}
	});
}

addMatch(simpleReplacePattern, 'doReplace');
