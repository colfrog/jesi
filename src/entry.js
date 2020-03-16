import fs from 'fs';

import ServerInfo from './proto/server-info';
import UserInfo from './proto/user-info';
import IRC from './irc/irc';

import ModulesHandler from './modules/modules-handler';

// Parse userInfo and servInfo from config.json
// TODO: Use a format that allows users to re-use their userInfo?
const configFile = process.cwd() + '/config.json';
fs.access(configFile, fs.constants.R_OK, err => {
	if (err)
		throw err;

	const config = require(configFile);
	var client = new IRC();
	config.servers.forEach((servInfo) => {
		client.addServer(servInfo);
		let serv = client.getServer(servInfo.name);
		let modsHandler = new ModulesHandler(serv, config.commandPrefix, config.modules);
		serv.connect();
	});
});
