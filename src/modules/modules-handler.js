import Module from './module';
import coreModules from '../core-modules/core-modules.json';

// TODO: Allow rewriting the JSON files
export default class ModulesHandler {
	constructor(server, prefix, modules) {
		this.server = server || throw 'Modules handler was created without a valid server.';
		this.prefix = prefix || '';
		this.modules = {};

		if (!modules || typeof modules !== 'object' || !modules.forEach)
			return;

		this.initModules(coreModules.concat(modules));

		server.hooks.add('*', this.toModules.bind(this));
		server.hooks.addPreInit(this.runPreInit.bind(this));
		server.hooks.addPostInit(this.runPostInit.bind(this));
		server.hooks.addClosing(this.runClosing.bind(this));
	}

	async addModule(modulePath) {
		let module = new Module(this.server, this.prefix, modulePath);
		let name = module.name;
		await module.init(this.server);

		if (this.modules[name])
			throw 'Module ' + name + ' was defined twice.';
		else
			this.modules[name] = module;
	}

	delModule(name) {
		if (this.modules[name])
			delete this.modules[name];
	}

	refreshModule(name) {
		this.modules[name].refresh();
	}

	refreshModules() {
		Object.values(this.modules).forEach(module => module.refresh());
	}

	initModules(modules) {
		modules.forEach(this.addModule.bind(this));
	}

	toModules(server, msgData) {
		let hooks = server.hooks;
		Object.values(this.modules).forEach((module) => {
			module.handleMessage(msgData);
		});
	}

	runPreInit(server) {
		Object.values(this.modules).forEach(module => module.runPreInit());
	}

	runPostInit(server) {
		Object.values(this.modules).forEach(module => module.runPostInit());
	}

	runClosing(server) {
		Object.values(this.modules).forEach(module => module.runClosing());
	}
}
