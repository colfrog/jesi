function registerClient() {
	const pass = serverInfo.pass;
	const realname = serverInfo.user.realname;
	const ident = serverInfo.user.ident;
	const nick = serverInfo.user.nick;

	if (pass)
		ircWriter.sendCommand('PASS', pass);

	ircWriter.sendCommand('NICK', nick);
	ircWriter.sendCommand('USER', [ident, '*', '*', realname]);
}

addPreInit('registerClient()');
