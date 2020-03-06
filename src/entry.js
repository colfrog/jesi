import ServerInfo from './irc/server-info';
import UserInfo from './irc/user-info';
import IRC from './irc/irc';

var client = new IRC();
// TODO: Parse userInfo and servInfo from a configuration file
var userInfo = new UserInfo({
	realname: 'Jessie Jane',
	ident: 'jesi',
	nick: 'jesi'
});
var otherUserInfo = new UserInfo ({
	realname: 'Jessie Jane',
	ident: 'jesi',
	nick: 'jesijane'
});

var servInfo = new ServerInfo({
	userInfo: userInfo,
	name: 'Snoonet',
	host: 'irc.snoonet.org',
	port: 6697, // TLS is known from the port
	channels: ['#jesi', '#jesi-dev']
});
client.addServer(servInfo, userInfo);

/*
servInfo = new ServerInfo({
	userInfo: otherUserInfo,
	name: 'Rizon',
	host: 'irc.rizon.net',
	port: 6697
});
client.addServer(servInfo, userInfo);

servInfo = new ServerInfo({
	userInfo: otherUserInfo,
	name: 'Freenode',
	host: 'irc.freenode.net',
	port: 6697
});
client.addServer(servInfo);
*/
