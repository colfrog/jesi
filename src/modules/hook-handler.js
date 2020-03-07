export default class HookHandler {
	constructor(module) {
		this.module = module || throw 'Module not given to hook handler.';
		this.hooks = {};
	}

	run(msgData) {
		let snippets = this.hooks[msgData.command];
		if (snippets) {
			snippets.forEach((code) => {
				if (typeof code === 'string')
					this.module.run(code);
			});
		}
	}

	add(command, code) {
		if (this.hooks[command])
			this.hooks[command] = [code];
		else
			this.hooks[command].push(code);
	}

	del(command, code) {
		let commands = this.hooks.keys();
		for (let i = 0; i < commands.length; i++) {
			let snippets = this.hooks[commands[i]];
			for (let j = 0; j < snippets.length; j++)
				if (command === commands[i] && code === snippets[j])
					delete this.hooks[commands[i]][j];
		}
	}
}
