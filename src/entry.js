import irc from './irc/irc';

var client = new irc();
client.add_server('Snoonet', 'irc.snoonet.org', 6697, true);
