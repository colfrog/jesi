import ServerInfo from './irc/ServerInfo';
import UserInfo from './irc/UserInfo';
import IRC from './irc/IRC';

var client = new IRC();
// TODO: Parse userInfo and servInfo from a configuration file
var userInfo = new UserInfo({
	realname: 'Jessie Jane',
	ident: 'jesi',
	nick: 'jesi'
});
var servInfo = new ServerInfo({
	name: 'Snoonet',
	host: 'irc.snoonet.org',
	port: 6697 // TLS is known from the port
});

client.addServer(servInfo, userInfo);

servInfo = new ServerInfo({
	name: 'Rizon',
	host: 'irc.rizon.net',
	port: 6697
});
client.addServer(servInfo, userInfo);

servInfo = new ServerInfo({
	name: 'Freenode',
	host: 'irc.freenode.net',
	port: 6697
});
client.addServer(servInfo, userInfo);
