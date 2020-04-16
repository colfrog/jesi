const jModule = {
	"name": "NickServ Registration",
	"description": "Register through NickServ",
	"core": true
};

function doNickserv() {
	const ident = serverInfo.nsIdent;
	const pass = serverInfo.nsPass;

	if (typeof ident === 'string' && typeof pass === 'string' &&
	    ident.length > 0 && pass.length > 0) {
		let text = 'IDENTIFY ' + ident + ' ' + pass;
		ircWriter.sendMessage('NickServ', text);
	}
}

addPostInit('doNickserv');
