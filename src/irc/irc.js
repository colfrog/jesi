import server from './server';

export default class irc {
	constructor(server_name, host_name, port, tls) {
		this.servers = {};
		if (typeof server_name !== 'undefined' &&
			typeof host_name !== 'undefined' &&
			typeof port !== 'undefined')
			this.add_server(server_name, host_name, port, tls);
	}

	add_server(server_name, host_name, port, tls) {
		this.servers[server_name] = new server(server_name, host_name, port, tls);
	}
}
