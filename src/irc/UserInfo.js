export default class UserInfo {
	/*
	 * TODO: Make the defaults globally configurable
	 * The user object:
	 * realname: Your real name (default 'Jesi Jane')
	 * ident: Your IRC identity (default 'jesi')
	 * nick: Your IRC nickname (default 'jesi')
	 * nsIdent: Your NickServ identity, unused if undefined
	 * nsPass: Your NickServ password, unused if undefined
	 */
	constructor(user) {
		this.realname = user.realname || 'Jessie Jane';
		this.ident = user.ident || 'jesi';
		this.nick = user.nick || 'jesi';
		this.nsIdent = user.nsIdent;
		// TODO: secure the password?
		this.nsPass = user.nsPass;

		// TODO: Add SASL info and work towards supporting it
	}
}
