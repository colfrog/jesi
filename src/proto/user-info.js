export default class UserInfo {
	/*
	 * TODO: Make the defaults globally configurable
	 * The UserInfo object:
	 * realname: The user's real name (required)
	 * ident: The user's IRC identity (required)
	 * nick: The user's IRC nickname (required)
	 * host: The user's IRC host (default to null)
	 * server: The server that the user is connected to (default to null)
	 */
	constructor(user) {
		this.realname = user.realname || throw 'The real name is required.';
		this.ident = user.ident || throw 'The user identity is required.';
		// TODO: Support a list for the nick
		this.nick = user.nick || throw 'The nickname is required.';
		this.host = user.host || null;
		this.server = user.server || null;

		// Set manually
		this.oper = false;
		this.away = false;
		this.modes = '';

		// TODO: Find a way to save channels between sessions
		// This object takes a channel as key and a modestring as value
		this.channels = {}
		let channels = user.channels || [];
		channels.forEach((channel) => this.channels[channel] = '');
	}

	update(user) {
		this.realname = user.realname || this.realname;
		this.ident = user.ident || this.ident;
		this.nick = user.nick || this.nick;
		this.host = user.host || this.host;
		this.server = user.server || this.server;
		user.channels.forEach(channel => this.channels[channel] = this.channels[channel] || '');
	}
}
