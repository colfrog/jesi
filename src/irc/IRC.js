import Server from './Server';

export default class IRC {
	constructor() {
		this.servers = {};
	}

	addServer(servInfo, userInfo) {
		this.servers[servInfo.name] = new Server(servInfo, userInfo);
	}

	getServer(name) {
		return this.servers[name];
	}

	removeServer(name) {
		this.servers[name].close();
		this.servers[name] = null;
	}
}
