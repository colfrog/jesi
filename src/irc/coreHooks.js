// TODO: Eventually move to the extension subsystem
export default function coreHooks() {}

function register(server) {
	const pass = server.user.pass;
	const realname = server.user.realname;
	const ident = server.user.ident;
	const nick = server.user.nick;

	if (pass)
		// TODO: Make a wrapper for commands
		server.write('PASS :' + pass);

	// TODO: Make a wrapper for commands
	server.write('NICK ' + nick);
	server.write('USER ' + ident + ' * * :' + realname);
}

async function nickserv(server) {
	const ident = server.user.nsIdent;
	const pass = server.user.nsPass;

	if (ident && pass)
		// TODO: Make a wrapper around PRIVMSG
		server.write('PRIVMSG NickServ :IDENTIFY ' + ident + ' ' + pass);
}

async function joinChannels(server) {
	// TODO: Make a wrapper for commands
	server.write('JOIN :' + server.info.channels);
}

async function ping(server, msgData) {
	// TODO: Make a wrapper for commands
	server.write('PONG ' + msgData.params[0]);
}

// TODO: Find a good IRC command to respond to to execute the post-init hooks
coreHooks.addTo = function(hooks) {
	hooks.addPreInit(register);
	hooks.addPostInit(nickserv);
	hooks.addPostInit(joinChannels);
	hooks.add('PING', ping);
}
