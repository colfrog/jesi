import Server from './server';

export default class IRC {
	constructor() {
		this.servers = {};
	}

	addServer(servInfo) {
		this.servers[servInfo.name] = new Server(servInfo);
	}

	getServer(name) {
		return this.servers[name];
	}

	removeServer(name) {
		this.servers[name].close();
		delete this.servers[name];
	}

	on(command, callback) {
		// TODO: Add hook to even future servers
		this.servers.keys().forEach((name) => {
			this.servers[name].on(command, callback);
		});
	}
}
