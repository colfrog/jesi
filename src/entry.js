import fs from 'fs';

import ServerInfo from './proto/server-info';
import UserInfo from './proto/user-info';
import IRCClient from './irc/client';
import Jesi from './jesi';
import Config from './proto/config';

import ModulesHandler from './modules/modules-handler';
import APIWebsocketServer from './api/websocket-server';

// Parse userInfo and servInfo from config.json
const config = new Config(),
	jesi = new Jesi(IRCClient),
	{ servers, commandPrefix, modules } = config;

servers.forEach(async servInfo => {
	const server = jesi.addServer(servInfo);
	server.modules = new ModulesHandler(server, commandPrefix, modules);
	await server.modules.initModules();

	server.connect();
});

const wsServer = new APIWebsocketServer(jesi, 'localhost', 4222);
