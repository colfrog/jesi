import fs from 'fs';

import ServerInfo from './proto/server-info';
import UserInfo from './proto/user-info';
import IRCClient from './irc/client';
import Jesi from './jesi';
import Config from './proto/config';

import ModulesHandler from './modules/modules-handler';

// Parse userInfo and servInfo from config.json
const config = new Config(),
	client = new Jesi(IRCClient),
	{ servers, commandPrefix, modules } = config
;

servers.forEach(async servInfo => {
	const server = client.addServer(servInfo);
	const modsHandler = new ModulesHandler(server, commandPrefix, modules);
	await modsHandler.initModules();

	server.connect();
});
