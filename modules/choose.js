function doChoose(msgData) {
	// Get rid of the command
	let text = msgData.tail.split(' ').slice(1).join(' ');
	let commaSpaceList = text.split(', ');
	let commaList = text.split(',');
	let spaceList = text.split(' ');

	// Priority is comma -> commaSpace -> space
	choices = commaSpaceList.length > 1 ?
		commaSpaceList :
		spaceList;
	choices = commaList.length > choices.length ?
		commaList :
		choices;

	let index = Math.floor(Math.random() * choices.length);
	ircWriter.sendMessage(msgData.replyTarget, msgData.nick + ': ' + choices[index]);
}

addCommand('choose', 'doChoose');
