// TODO: This is very similar to HookHandler, needs more abstraction.
export default class CommandHandler {
	constructor(module) {
		this.module = module || throw 'Module not given to command handler.';
		this.commands = {};
	}
	
	run(msgData) {
		if (!msgData.tail.startsWith(this.module.prefix))
			return;

		let command = msgData.tailWords[0];
		let snippets = this.commands[command];
		if (snippets) {
			snippets.forEach((code) => {
				if (typeof code === 'string')
					this.module.run(code, msgData);
			});
		}
	}

	add(command, code) {
		const realCommand = this.module.prefix + command;
		if (this.commands[realCommand])
			this.commands[realCommand].push(code);
		else
			this.commands[realCommand] = [code];
	}

	del(command, code) {
		let commands = Object.keys(this.commands);
		if (!commands)
			return;

		let realCommand = this.module.prefix + command;
		for (let i = 0; i < commands.length; i++) {
			let snippets = this.commands[commands[i]];
			for (let j = 0; j < snippets.length; j++)
				if (realCommand === commands[i] && code === snippets[j])
					delete this.commands[commands[i]][j];
		}
	}
}
