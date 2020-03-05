// TODO: Eventually move to the extension subsystem
export default function coreHooks() {}

function registerClient(server) {
	const pass = server.info.user.pass;
	const realname = server.info.user.realname;
	const ident = server.info.user.ident;
	const nick = server.info.user.nick;

	if (pass)
		// TODO: Make a wrapper for commands
		server.write('PASS :' + pass);

	// TODO: Make a wrapper for commands
	server.write('NICK :' + nick);
	server.write('USER ' + ident + ' * * :' + realname);
}

function doPostInit(server, msgData) {
	console.log('Running post-init hooks for ' + server.info.name + '.');
	server.hooks.runPostInitHooks(server);
}

function handleNickserv(server) {
	const ident = server.info.nsIdent;
	const pass = server.info.nsPass;

	if (ident && pass)
		// TODO: Make a wrapper around PRIVMSG
		server.write('PRIVMSG NickServ :IDENTIFY ' + ident + ' ' + pass);
}

function joinChannels(server) {
	// TODO: Make a wrapper for commands
	let channels = server.info.channelNames;
	if (channels.length > 0)
		server.write('JOIN :' + channels.join(','));
}

function doPong(server, msgData) {
	// TODO: Make a wrapper for commands
	server.write('PONG :' + msgData.params[0]);
}

function onInvite(server, msgData) {
	server.write('JOIN :' + msgData.tail);
}

// TODO: Remove as soon as there's a better way
function doBlam(server, msgData) {
	if (msgData.tail.match(/^blam$/))
		server.write('NICK ' + server.info.user.nick);
}

// TODO: Find a good IRC command to respond to to execute the post-init hooks
coreHooks.addTo = function(server) {
	let hooks = server.hooks;
	hooks.addPreInit(registerClient);
	hooks.addPostInit(handleNickserv);
	hooks.add('001', doPostInit);
	hooks.add('PING', doPong);
	hooks.add('PRIVMSG', doBlam);

	if (server.info.nsIdent && server.info.nsPass)
		hooks.add('900', joinChannels);
	else
		hooks.addPostInit(joinChannels);
}
