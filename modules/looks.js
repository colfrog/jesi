var jModule = {
	"name": "looks",
	"description": "Look the other way, like you always do.",
	"permissions": {
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
	'o': ['-', '^'],
	'O': ['-', '^'],
	'=': '||',
	'||': '__',
	'__': ['@', '#', '*', '((', '))'],
	'@': '#',
	'#': '*',
	'((': '(-(',
	'))': ')-)',
	'*': ['(-(', ')-)', '(_O_)', '(---)'],
	'(-(': ')-)',
	')-)': '(-(',
	'(_O_)': ['(---)', '(O__)', '(__O)'],
	'(---)': '(_O_)',
	'(O__)': ['(O__)', '(_O_)', '(__O)'],
	'(__O)': ['(O__)', '(_O_)', '(__O)'],
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

function getEyes(text) {
	let eyes = [null, null];

	Object.keys(subst).forEach(eye => {
		let index = text.indexOf(eye);
		if (index == -1)
			return;
		if (index > 0) {
			eyes[1] = eye;
			return;
		}

		eyes[0] = eye;
		if (text.substring(eye.length).indexOf(eye) != -1)
			eyes[1] = eye;
	});

	return eyes;
}

function doLooks(msgData) {
	let text = msgData.tail;
	let eyes = getEyes(text);

	if (eyes[0] === null || eyes[1] === null)
		return;
	if (eyes[0].toLowerCase() !== eyes[1].toLowerCase())
		return;

	let left_eye = eye(subst[eyes[0]]);
	let right_eye = eye(subst[eyes[1]]);

	let mouth = text.substring(eyes[0].length);
	mouth = mouth.substring(0, mouth.indexOf(eyes[1]));
	if (!mouth)
		mouth = eyes[1];

	if (eyes[0] + mouth + eyes[1] !== text)
		return;

	if (subst[mouth])
		mouth = eye(subst[mouth]);

	let response = left_eye + mouth + right_eye;

	ircWriter.sendMessage(msgData.replyTarget, response);
}

addMatch(/^\S{3,15}$/, 'doLooks');
