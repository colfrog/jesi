export default class UserInfo {
	/*
	 * TODO: Make the defaults globally configurable
	 * The user object:
	 * realname: Your real name (default 'Jesi Jane')
	 * ident: Your IRC identity (default 'jesi')
	 * nick: Your IRC nickname (default 'jesi')
	 */
	constructor(user) {
		this.realname = user.realname || 'Jessie Jane';
		this.ident = user.ident || 'jesi';
		this.nick = user.nick || 'jesi';

		// TODO: extend so that it can represent any user on IRC
	}
}
