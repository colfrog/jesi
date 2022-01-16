export default class Hooks {
	constructor() {
		this._hooks = {};
		this._preInitKey = '%PREINIT%';
		this._postInitKey = '%POSTINIT%';
		this._closingKey = '%CLOSING%';

		// Do post-init hooks when the server sends 001
		this.add('001', this.runPostInit.bind(this));
	}

	add(command, func) {
		const hook = this._hooks[command];
		if (!hook)
			this._hooks[command] = [func];
		else if (!hook.find(elem => elem === func))
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

	remove(command, func) {
		let hook = this._hooks[command];
		if (hook)
			this._hooks[command] = hook.filter(elem => elem !== func);
	}

	removePreInit(func) {
		this.remove(this._preInitKey, func);
	}

	removePostInit(func) {
		this.remove(this._postInitKey, func);
	}

	removeClosing(func) {
		this.remove(this._closingKey, func);
	}

	runCommand(server, msgData) {
		this.run('*', server, msgData);
		this.run(msgData.command, server, msgData);
	}

	runPreInit(server) {
		console.log('Running pre-init hooks for ' + server.info.name + '.');
		this.run(this._preInitKey, server, null);
	}

	runPostInit(server) {
		console.log('Running post-init hooks for ' + server.info.name + '.');
		this.run(this._postInitKey, server, null);
	}

	runClosing(server) {
		console.log('Running closing hooks for ' + server.info.name + '.');
		this.run(this._closingKey, server, null);
	}

	run(command, server, msgData) {
		if (this._hooks[command])
			this._hooks[command].forEach(async (f) => f(server, msgData));
	}
}
