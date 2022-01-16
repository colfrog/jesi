export default class Jesi {
	constructor(clientProvider) {
		this.clientProvider = clientProvider;
		this.clients = {};
                this.global_hooks = {};
	}

	addServer(info) {
		let client = new this.clientProvider(info);
                let gh = this.global_hooks;
                Object.keys(gh).forEach(key => {
                        client.hooks.add(key, gh[key]);
                });

		this.clients[info.name] = client;
		return client;
	}

	deleteServer(name) {
		this.clients[name].close();
		delete this.clients[name];
	}

	on(key, callback) {
                let gh = this.global_hooks;
                if (gh[key])
                        gh[key].push(callback);
                else
                        gh[key] = [callback];

                Object.values(this.clients).forEach(client => client.hooks.add(key, callback));
	}

        no(key, callback) {
                let gh = this.global_hooks;
                if (gh[key])
                        gh[key] = gh[key].filter(elem => elem !== callback);

                Object.values(this.clients).forEach(client => client.hooks.remove(key, callback));
        }
}
