import ServerInfo from './irc/ServerInfo';
import UserInfo from './irc/UserInfo';
import IRC from './irc/IRC';

var servInfo = new ServerInfo({
	name: 'Snoonet',
	host: 'irc.snoonet.org',
	port: 6697
});
var userInfo = new UserInfo({
	realname: 'Jessie Jane',
	ident: 'jesi',
	name: 'jesi'
});

var client = new IRC();
client.addServer(servInfo, userInfo);
