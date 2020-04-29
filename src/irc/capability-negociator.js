export default class CapabilityNegociator {
	constructor(client) {
		this.client = client;
		this.caps = {};

		this.client.hooks.add('CAP', this._onCAP.bind(this));
	}

	add(cap, callback) {
		let caps = this.caps;
		if (caps[cap])
			caps[cap].push(callback);
		else
			caps[cap] = [callback];
	}

	del(cap, callback) {
		let callbacks = this.caps[cap];
		if (!callbacks)
			return;
		if (callbacks.length === 1) {
			console.log('Capability negociation finished for ' + cap);
			delete this.caps[cap];
		} else {
			this.caps[cap] = callbacks.filter(cb => cb !== callback);
		}

		this._finishIfDone();
	}

	request() {
		let keys = Object.keys(this.caps);
		if (keys.length > 0)
			this.client.writer.sendCommand('CAP', ['REQ', keys.join(' ')]);
	}

	_finishIfDone() {
		let keys = Object.keys(this.caps);
		if (keys.length === 0)
			this.client.writer.sendCommand('CAP', 'END');
	}

	_onCAP(client, msgData) {
		let keys = Object.keys(this.caps);
		for (let i = 0; i < keys.length; i++)
			this.caps[keys[i]].forEach(callback => callback(msgData));
	}
}
