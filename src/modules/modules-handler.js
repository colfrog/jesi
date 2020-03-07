import Module from './module';

export default class ModulesHandler {
	constructor(server, prefix, modules) {
		this.server = server || throw 'Modules handler was created without a valid server.';
		this.prefix = prefix || '';
		this.modules = [];

		if (!modules || typeof modules !== 'object' || !modules.forEach)
			return;

		this.initModules(modules);

		server.hooks.add('*', this.toModules.bind(this));
		server.hooks.addPreInit(this.runPreInit.bind(this));
		server.hooks.addPostInit(this.runPostInit.bind(this));
		server.hooks.addClosing(this.runClosing.bind(this));
	}

	initModules(modules) {
		modules.forEach((elem) => {
			let module = new Module(this.server, this.prefix, elem);
			let name = module.name;
			module.init(this.server);

			if (this.modules[name])
				throw 'Module ' + name + ' was defined twice.';
			else
				this.modules.push(module);
		});
	}

	toModules(server, msgData) {
		let hooks = server.hooks;
		this.modules.forEach((module) => {
			module.handleMessage(msgData);
		});
	}

	runPreInit(server) {
		this.modules.forEach(module => module.runPreInit());
	}

	runPostInit(server) {
		this.modules.forEach(module => module.runPostInit());
	}

	runClosing(server) {
		this.modules.forEach(module => module.runClosing());
	}
}
