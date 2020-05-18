var jModule = {
	"name": "NickServ Registration",
	"description": "Register through NickServ",
	"core": true
};

function doNickserv() {
	if (serverInfo.regMethod !== 'nickserv')
		return;

	const user = serverInfo.regUser;
	const pass = serverInfo.regPass;

	if (typeof user === 'string' && typeof pass === 'string') {
		let text = 'IDENTIFY ' + user + ' ' + pass;
		ircWriter.sendMessage('NickServ', text);
	}
}

addPostInit('doNickserv');
