var jModule = {
	"name": "cheer",
	"description": "Cheer on \\o/",
	"permissions": {
		"hasIRCWriter": true
	}
};

let cheers = [
	'FSCK(8) YEAH!',
	'HOORAH!',
	'HURRAY!',
	'OORAH!',
	'YAY!',
	'*\\o/* CHEERS! *\\o/*',
	'HOOHAH!',
	'HOOYAH!',
	'HUAH!',
];

function doCheer(msgData) {
	let index = Math.floor(Math.random()*cheers.length);
	ircWriter.sendMessage(msgData.replyTarget, cheers[index]);
}

addMatch(/\\o\//, 'doCheer');
