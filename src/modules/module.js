import fs from 'fs';
import vm from 'vm';

import ModulePermissions from './module-permissions';
import HookHandler from './hook-handler';
import CommandHandler from './command-handler';

// TODO: extend to support webassembly
export default class Module {
	/*
	 * The Module object:
	 * name: The module's name (required)
	 * description: The module's description (default to '')
	 * path: Path to the entry file (required)
	 * prefix: The command prefix (default to '')
	 * permissions: A ModulePermissions object (required)
	 * settings: Module-specific settings
	 */
	constructor(server, prefix, params) {
		this.server = server || throw 'Module server is required.';
		this.name = params.name || throw 'Module name is required.';
		this.description = params.description || '';
		this.path = params.path || throw 'Module entry path is required';
		this.prefix = prefix || '';
		this.core = params.core || false;
		this.perms = new ModulePermissions(this.core, params.permissions);
		this.settings = params.settings || {};

		this.preinit = [];
		this.postinit = [];
		this.closing = [];
		this.hooks = new HookHandler(this);
		this.commands = new CommandHandler(this);

		this.context = {};
		this._contextOptions = {
			contextName: this.name + ' (module)',
			contextCodeGeneration: {
				strings: false,
				wasm: false
			}
		};
		this._scriptOptions = {
			filename: this.path,
			produceCachedData: true
		};
	}

	buildContext(server) {
		let perms = this.perms;
		let serverInfo = null;
		let ircWriter = null;
		if (perms.hasServerInfo)
			serverInfo = server.info;
		if (perms.hasIRCWriter)
			ircWriter = server.writer;

		let context = {
			console: console,
			require: require,
			commandPrefix: this.prefix,
			settings: this.settings,
			serverInfo: serverInfo,
			ircWriter: ircWriter,
			addPreInit: this.addPreInit.bind(this),
			addPostInit: this.addPostInit.bind(this),
			addClosing: this.addClosing.bind(this),
			addHook: this.hooks.add.bind(this.hooks),
			delHook: this.hooks.del.bind(this.hooks),
			addCommand: this.commands.add.bind(this.commands),
			delCommand: this.commands.del.bind(this.commands),
		};

		return vm.createContext(context);
	}

	handleMessage(msgData) {
		this.hooks.run(msgData);
		if (msgData.command === 'PRIVMSG')
			this.commands.run(msgData);
	}

	async run(code, msgData) {
		// TODO: Handle code errors gracefully
		// TODO: Find a better way of passing msgData, this is evil
		vm.runInContext(code + '(' + JSON.stringify(msgData) + ')',
			this.context, this._contextOptions);
	}

	async init(server) {
		// TODO: Add checks before fs.readFile
		fs.readFile(this.path, (err, data) => {
			if (err !== null)
				throw err;

			// TODO: Add sanity and error-handling
			this.context = this.buildContext(server);
			vm.runInContext(data, this.context, this._contextOptions);
		});
	}

	async refresh() {
		fs.readFile(this.path, (err, data) => {
			if (err !== null)
				throw err;

			vm.runInContext(data, this.context, this._contextOptions);
		});
	}

	addPreInit(code) {
		this.preinit.push(code);
	}

	addPostInit(code) {
		this.postinit.push(code);
	}

	addClosing(code) {
		this.closing.push(code);
	}

	runPreInit() {
		this.preinit.forEach(code => this.run(code));
	}

	runPostInit() {
		this.postinit.forEach(code => this.run(code));
	}

	runClosing() {
		this.closing.forEach(code => this.run(code));
	}
}
