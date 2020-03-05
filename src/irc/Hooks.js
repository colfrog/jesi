export default class Hooks {
	constructor() {
		this._hooks = {};
		this._preInitKey = '%PREINIT%';
		this._postInitKey = '%POSTINIT%';
		this._closingKey = '%CLOSING%';
	}

	add(command, func) {
		const hook = this._hooks[command];
		if (typeof hook === 'undefined' || hook === null)
			this._hooks[command] = [func];
		else
			this._hooks[command].push(func);
	}

	addPreInit(func) {
		this.add(this._preInitKey, func);
	}

	addPostInit(func) {
		this.add(this._postInitKey, func);
	}

	addClosing(func) {
		this.add(this._closingKey, func);
	}

	_runHook(command, server, msgData) {
		if (this._hooks[command])
			this._hooks[command].forEach(async (f) => f(server, msgData));
	}

	runPreInitHooks(server) {
		this._runHook(this._preInitKey, server, null);
	}

	runPostInitHooks(server) {
		this._runHook(this._postInitKey, server, null);
	}

	runClosingHooks(server) {
		this._runHook(this._closingKey, server, null);
	}

	runHooks(server, msgData) {
		this._runHook('*', server, msgData);
		this._runHook(msgData.command, server, msgData);
	}
}
