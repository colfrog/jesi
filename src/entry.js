import fs from 'fs';

import ServerInfo from './irc/server-info';
import UserInfo from './irc/user-info';
import IRC from './irc/irc';

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
		client.getServer(servInfo.name).connect();
	});
});
