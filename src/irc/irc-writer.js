export default class IRCWriter {
	constructor(server) {
		this._server = server;
		this._actionParam = '\x01ACTION';
	}

	sendRaw(data) {
		if (typeof data !== 'string' || data.length === 0)
			return;

		const msg = this._sanitize(data);
		this._server.write(msg);
	}

	sendCommand(command, args) {
		if (typeof command !== 'string' || command.length === 0)
			throw 'Invalid arguments to IRCWriter.sendCommand';
		if (typeof args === 'string' && args.length > 0)
			return this.sendRaw(command + ' :' + args);
		if (typeof args !== 'object')
			throw 'Invalid command arguments passed to IRCWriter.sendCommand';

		let msg = command;
		for (let i = 0; i < args.length; i++) {
			if (i === args.length - 1)
				msg += ' :' + args[i];
			else
				msg += ' ' + args[i];
		}

		this.sendRaw(msg);
	}

	sendMessage(target, text) {
		this.sendCommand('PRIVMSG', [target, text]);
	}

	sendAction(target, text) {
		this.sendCommand('PRIVMSG', [target, this._actionParam, text + '\x01']);
	}

	sendNotice(target, text) {
		this.sendCommand('NOTICE', [target, text]);
	}

	joinChannels(channels) {
		this.sendCommand('JOIN', channels.join(','));
	}

	partFrom(channel, text) {
		this.sendCommand('PART', [channel, text]);
	}

	// TODO: Improve sanitation
	_sanitize(data) {
		return data.trim() + '\r\n';
	}
}
