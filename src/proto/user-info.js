export default class UserInfo {
	/*
	 * TODO: Make the defaults globally configurable
	 * The UserInfo object:
	 * realname: Your real name (required)
	 * ident: Your IRC identity (required)
	 * nick: Your IRC nickname (required)
	 */
	constructor(user) {
		this.realname = user.realname || throw 'The real name is required.';
		this.ident = user.ident || throw 'The user identity is required.';
		// TODO: Support a list for the nick
		this.nick = user.nick || throw 'The nickname is required.';
		// TODO: Find a way to save channels between sessions
		this.channelNames = user.channels || [];
	}
}
