export default class Jesi {
	constructor(clientProvider) {
		this.clientProvider = clientProvider;
		this.clients = {};
		this.hooks = {};
	}

	addServer(info) {
		let client = new this.clientProvider(info);

		Object.keys(this.hooks).forEach(key => {
			client.on(key, callback);
		});

		this.clients[info.name] = client;
		return client;
	}

	deleteServer(name) {
		this.clients[name].close();
		delete this.clients[name];
	}

	on(key, callback) {
		Object.keys(this.hooks).forEach(name => {
			if (this.hooks[key])
				this.hooks[key].append(callback);
			else
				this.hooks[key] = [callback];

			this.clients[name].on(key, callback);
		});
	}
}
