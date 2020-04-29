var jModule = {
	"name": "SASL",
	"description": "SASL authentication support",
	"core": true
};

function negociate(msgData) {
	if (serverInfo.regMethod !== 'sasl' ||
	    typeof serverInfo.regUser !== 'string' ||
	    typeof serverInfo.regPass !== 'string')
		endCap();

	if (msgData.params[1] === 'ACK' && msgData.tail === 'sasl')
		ircWriter.sendCommand('AUTHENTICATE', 'PLAIN');
}

function authenticate(msgData) {
	if (msgData.params[0] !== '+')
		return;

	let user = serverInfo.regUser;
	let pass = serverInfo.regPass;
	let b64 = Buffer.from(`\u0000${user}\u0000${pass}`).toString('base64');
	ircWriter.sendCommand('AUTHENTICATE', b64);

	endCap();
}

negociateCap('sasl', 'negociate');
addHook('AUTHENTICATE', 'authenticate');
addHook('900', 'endCap');
addHook('904', 'endCap');
