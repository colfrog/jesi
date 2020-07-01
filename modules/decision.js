const crypto = require('crypto');

var jModule = {
	"name": "decision",
	"description": "Ease decisions",
	"permissions": {
		"hasIRCWriter": true,
		"hasRequire": true
	}
};

function randomNumber(max) {
	return crypto.randomBytes(1)[0] % max;
}

function doDecide(msgData) {
	let who = msgData.nick;
	let choice = randomNumber(2) ? 'yes' : 'no';
	ircWriter.sendMessage(msgData.replyTarget, who + ': ' + choice + '.');
}

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

	let index = randomNumber(choices.length);
	ircWriter.sendMessage(msgData.replyTarget, msgData.nick + ': ' + choices[index]);
}

addCommand('decide', 'doDecide');
addCommand('choose', 'doChoose');
