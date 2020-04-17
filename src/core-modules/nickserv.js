const jModule = {
	"name": "NickServ Registration",
	"description": "Register through NickServ",
	"core": true
};

function doNickserv() {
	if (serverInfo.regMethod !== 'nickserv')
		return;

	const user = serverInfo.regUser;
	const pass = serverInfo.regPass;

	if (typeof ident === 'string' && typeof pass === 'string' &&
	    ident.length > 0 && pass.length > 0) {
		let text = 'IDENTIFY ' + user + ' ' + pass;
		ircWriter.sendMessage('NickServ', text);
	}
}

addPostInit('doNickserv');
