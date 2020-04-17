var jModule = {
	"name": "SASL",
	"description": "SASL authentication support",
	"core": true
};

// TODO: Expose a callback-based capability negociation API instead of doing this manually
function requestCapability() {
	if (serverInfo.regMethod !== 'sasl' ||
	    typeof serverInfo.regUser !== 'string' ||
	    typeof serverInfo.regPass !== 'string')
		return;

	// TODO: negociate SASL mechanism, support many to allow for configuration
	ircWriter.sendCommand('CAP', ['REQ', 'sasl']);
	addHook('CAP', 'capAcknowledged');
}

function capAcknowledged(msgData) {
	if (msgData.params[1] === 'ACK' && msgData.tail === 'sasl') {
		ircWriter.sendCommand('AUTHENTICATE', 'PLAIN');
		removeHook('CAP', 'capAcknowledged');
	}
}

function endCap() {
	ircWriter.sendCommand('CAP', 'END');
}

function authenticate(msgData) {
	if (msgData.params[0] !== '+')
		return;

	let user = serverInfo.regUser;
	let pass = serverInfo.regPass;
	let b64 = Buffer.from(`\u0000${user}\u0000${pass}`).toString('base64');
	ircWriter.sendCommand('AUTHENTICATE', b64);
}

addPreInit('requestCapability');
addHook('900', 'endCap');
addHook('904', 'endCap');
addHook('AUTHENTICATE', 'authenticate');
