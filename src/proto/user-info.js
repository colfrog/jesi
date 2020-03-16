export default class UserInfo {
	/*
	 * TODO: Make the defaults globally configurable
	 * The UserInfo object:
	 * nick: The user's IRC nickname (required)
	 * ident: The user's IRC identity (default to null)
	 * realname: The user's real name (default to null)
	 * host: The user's IRC host (default to null)
	 * server: The server that the user is connected to (default to null)
	 */
	constructor(user) {
		// TODO: Support a list for the nick
		this.nick = user.nick || throw 'The nickname is required.';
		this.ident = user.ident || null;
		this.realname = user.realname || null;
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
		if (!user)
			return;

		this.realname = user.realname || this.realname;
		this.ident = user.ident || this.ident;
		this.nick = user.nick || this.nick;
		this.host = user.host || this.host;
		this.server = user.server || this.server;
		user.channels.forEach(channel => this.channels[channel] = this.channels[channel] || '');
	}
}
