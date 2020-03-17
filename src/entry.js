import fs from 'fs';

import ServerInfo from './proto/server-info';
import UserInfo from './proto/user-info';
import IRC from './irc/irc';
import Config from './proto/config';

import ModulesHandler from './modules/modules-handler';

// Parse userInfo and servInfo from config.json
const config = new Config(),
  client = new IRC(),
  { servers, commandPrefix, modules } =  config
;

servers.forEach(servInfo => {
  const server = client.addServer(servInfo);
  const modsHandler = new ModulesHandler(server, commandPrefix, modules);

  server.connect();
});
