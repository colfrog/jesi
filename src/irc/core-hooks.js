// TODO: Eventually move to the extension subsystem
export default function coreHooks() {}

function registerClient(server) {
	const pass = server.info.pass;
	const realname = server.info.user.realname;
	const ident = server.info.user.ident;
	const nick = server.info.user.nick;
	const writer = server.writer;

	if (pass)
		writer.sendCommand('PASS', pass);

	writer.sendCommand('NICK', nick);
	writer.sendCommand('USER', [ident, '*', '*', realname]);
}

function doPostInit(server, msgData) {
	console.log('Running post-init hooks for ' + server.info.name + '.');
	server.hooks.runPostInitHooks(server);
}

function handleNickserv(server) {
	const ident = server.info.nsIdent;
	const pass = server.info.nsPass;

	if (typeof ident === 'string' && typeof pass === 'string' &&
	    ident.length > 0 && pass.length > 0) {
		let text = 'IDENTIFY ' + ident + ' ' + pass;
		server.writer.sendMessage('NickServ', text);
	}
}

function joinChannels(server) {
	// TODO: Make a wrapper for commands
	let channels = server.info.channelNames;
	if (channels.length > 0)
		server.writer.joinChannels(channels);
}

function doNotice(server, msgData) {
	const match = msgData.tail.match(/^jesi, notice me please$/);
	const response = 'You are beautiful and you deserve to be loved.';

	if (msgData.fromUser && match !== null) {
		server.writer.sendNotice(msgData.nick, response);
	}
}

function doLeave(server, msgData) {
	let match = msgData.tail.match(/^leave, jesi$/);
	let channel = msgData.params[0];

	if (match !== null) {
		server.writer.sendAction(channel, 'cries');
		server.writer.partFrom(channel, ':(');
	}
}

function doPong(server, msgData) {
	// TODO: Make a wrapper for commands
	server.writer.sendCommand('PONG', msgData.params[0]);
}

function onInvite(server, msgData) {
	server.writer.sendCommand('JOIN', msgData.tail);
}

// TODO: Remove as soon as there's a better way
function doBlam(server, msgData) {
	if (msgData.tail.match(/^blam$/))
		server.writer.sendCommand('NICK', server.info.user.nick);
}

function doEcho(server, msgData) {
	let match = msgData.tail.match(/^echo\s(.+)$/);
	let channel = msgData.params[0];
	if (match !== null)
		server.writer.sendMessage(channel, match[1]);
}

function doAct(server, msgData) {
	let match = msgData.tail.match(/^act\!$/);
	let channel = msgData.params[0];
	if (match !== null)
		server.writer.sendAction(channel, 'acts');
}

// TODO: Find a good IRC command to respond to to execute the post-init hooks
coreHooks.addTo = function(server) {
	let hooks = server.hooks;
	hooks.addPreInit(registerClient);
	hooks.addPostInit(handleNickserv);
	hooks.add('001', doPostInit);
	hooks.add('PING', doPong);
	hooks.add('INVITE', onInvite);
	hooks.add('PRIVMSG', doNotice);
	hooks.add('PRIVMSG', doLeave);
	hooks.add('PRIVMSG', doBlam);
	hooks.add('PRIVMSG', doEcho);
	hooks.add('PRIVMSG', doAct);

	if (server.info.nsIdent && server.info.nsPass)
		hooks.add('900', joinChannels);
	else
		hooks.addPostInit(joinChannels);
}
