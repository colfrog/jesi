export default class Jesi {
	constructor(clientProvider) {
		this.clientProvider = clientProvider;
		this.clients = {};
	}

	addServer(info) {
		let client = new this.clientProvider(info);

		this.clients[info.name] = client;
		return client;
	}

	deleteServer(name) {
		this.clients[name].close();
		delete this.clients[name];
	}

	on(key, callback) {
                Object.values(this.clients).forEach(client => client.hooks.add(key, callback));
	}
}
