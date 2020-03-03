export default class UserInfo {
	/*
	 * TODO: Make the defaults globally configurable
	 * The user object:
	 * realname: Your real name (default 'Jesi Jane')
	 * ident: Your IRC identity (default 'jesi')
	 * name: Your IRC name (default 'jesi')
	 * nsIdent: Your NickServ identity, unused if undefined
	 * nsPass: Your NickServ password, unused if undefined
	 */
	constructor(user) {
		this.realname = user.realname || 'Jessie Jane';
		this.ident = user.ident || 'jesi';
		this.name = user.name || 'jesi';
		this._nsIdent = user.nsIdent;
		this._nsPass = user.nsPass;
	}
}
