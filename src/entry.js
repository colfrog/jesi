import IRC from './irc/IRC';

var client = new IRC();
client.addServer('Snoonet', 'irc.snoonet.org', 6697, true);
