import Server from './Server';

export default class IRC {
	constructor() {
		this.servers = {};
	}

	addServer(serverName, hostName, port, TLS) {
		this.servers[serverName] = new Server(serverName, hostName, port, TLS);
	}
}
