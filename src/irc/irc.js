import Client from './client';

export default class IRC {
	constructor() {
		this.clients = {};
	}

	addServer(servInfo) {
		this.clients[servInfo.name] = new Client(servInfo);
	}

	getServer(name) {
		return this.clients[name] || null;
	}

	removeServer(name) {
		this.clients[name].close();
		delete this.clients[name];
	}

	on(command, callback) {
		// TODO: Add hook to even future clients
		this.clients.keys().forEach((name) => {
			this.clients[name].on(command, callback);
		});
	}
}
