// TODO: This is very similar to HookHandler, needs more abstraction.
export default class CommandHandler {
	constructor(module) {
		this.module = module || throw 'Module not given to command handler.';
		this.commands = {};
	}

	run(msgData) {
		let command = getCommand(msgData);
		let snippets = this.commands[command];
		if (snippets) {
			snippets.forEach((code) => {
				if (typeof code === 'string')
					this.module.run(code);
			});
		}
	}

	add(command, code) {
		let realCommand = this.module.prefix + command;
		if (this.commands[realCommand])
			this.commands[realCommand] = [code];
		else
			this.commands[realCommand].push(code);
	}

	del(command, code) {
		let commands = this.commands.keys();
		let realCommand = this.module.prefix + command;
		for (let i = 0; i < commands.length; i++) {
			let snippets = this.commands[commands[i]];
			for (let j = 0; j < snippets.length; j++)
				if (realCommand === commands[i] && code === snippets[j])
					delete this.commands[commands[i]][j];
		}
	}
}
