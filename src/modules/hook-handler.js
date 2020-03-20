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
					this.module.run(code, msgData);
			});
		}
	}

	add(command, code) {
		if (this.hooks[command])
			this.hooks[command].push(code);
		else
			this.hooks[command] = [code];
	}

	del(command, code) {
		let commands = Object.keys(this.hooks);
		for (let i = 0; i < commands.length; i++) {
			let snippets = this.hooks[commands[i]];
			for (let j = 0; j < snippets.length; j++)
				if (command === commands[i] && code === snippets[j])
					delete this.hooks[commands[i]][j];
		}
	}
}
