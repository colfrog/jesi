import server from './server';

export default class irc {
	constructor() {
		this.servers = {};
	}

	add_server(server_name, host_name, port, tls) {
		this.servers[server_name] = new server(server_name, host_name, port, tls);
	}
}
