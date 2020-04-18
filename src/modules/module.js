import fs from 'fs';
import vm from 'vm';

import ModulePermissions from './module-permissions';
import HookHandler from './hook-handler';
import CommandHandler from './command-handler';
import MatchHandler from './match-handler';
import UserInfo from '../proto/user-info';
import { hasAtLeast } from '../proto/mode-parsing';

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
	constructor(modHandler, path) {
		this.handler = modHandler || throw 'Modules handler is required';
		this.server = modHandler.server;
		this.prefix = modHandler.prefix || '';
		this.path = path;

		this.preinit = [];
		this.postinit = [];
		this.closing = [];
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

		// TODO: Find a way to properly pass all javascript global objects
		let context = {
			console: console,
			Array: Array,
			String: String,
			Buffer: Buffer,
			Object: Object,
			JSON: JSON,
			Math: Math,
			require: () => { return {} },
			serverInfo: null,
			ircWriter: null,
			modHandler: null,
			commandPrefix: this.prefix,
			settings: this.settings,
			addPreInit: this.addPreInit.bind(this),
			addPostInit: this.addPostInit.bind(this),
			addClosing: this.addClosing.bind(this),
			addHook: this.hooks.add.bind(this.hooks),
			delHook: this.hooks.del.bind(this.hooks),
			addCommand: this.commands.add.bind(this.commands),
			delCommand: this.commands.del.bind(this.commands),
			addMatch: this.matches.add.bind(this.matches),
		};

		return vm.createContext(context);
	}

	handleMessage(msgData) {
		this.hooks.run(msgData);

		if (msgData.command === 'PRIVMSG') {
			this.commands.run(msgData);
			this.matches.run(msgData);
		}
	}

	async run(code, msgData) {
		// Update serverInfo before executing
		if (this.perms.hasServerInfo)
			this.context.serverInfo = this.server.info;

		// Check the user's privilege on PRIVMSG
		if (msgData && msgData.command === 'PRIVMSG') {
			let channel = msgData.params[0];
			let mode = this.server.info.channelRestrictions[channel];
			let user = this.server.info.users[msgData.nick];

			if (mode && user instanceof UserInfo) {
				let modeString = user.channels[channel];
				if (!hasAtLeast(modeString, mode))
					return;
			}
		}

		// TODO: Handle code errors gracefully
		// TODO: Find a better way of passing msgData, this is evil
		return vm.runInContext(code + '(' + JSON.stringify(msgData) + ')',
			this.context, this._contextOptions);
	}

	async init() {
		// TODO: Add checks before fs.readFile
		const data = await fs.promises.readFile(this.path);

		// TODO: Add sanity and error-handling
		this._initHandlers();
		this.context = this.buildContext(this.server);
		// Do a permission-less first run to gather module information from jModule
		vm.runInContext(data, this.context, this._contextOptions);

		let module = this.context.jModule;
		this.name = module.name || throw 'Module name is required.';
		this.description = module.description || '';
		this.core = module.core || false;
		this.settings = module.settings || {};
		this.perms = new ModulePermissions(this.core, module.permissions);

		// Now that the module is set up, properly load it
		await this.refresh();
	}

	async refresh() {
		this._initHandlers();
		this.context = this.buildContext(this.server);

		let perms = this.perms;
		if (perms.hasServerInfo)
			this.context.serverInfo = this.server.info;
		if (perms.hasIRCWriter)
			this.context.ircWriter = this.server.writer;
		if (perms.hasRequire)
			this.context.require = require;
		if (perms.hasModulesHandler)
			this.context.modHandler = this.handler;

		const data = await fs.promises.readFile (this.path);
		return vm.runInContext(data, this.context, this._contextOptions);
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

	_initHandlers() {
		this.hooks = new HookHandler(this);
		this.commands = new CommandHandler(this);
		this.matches = new MatchHandler(this);
	}
}
