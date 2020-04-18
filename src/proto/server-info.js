import ChannelInfo from './channel-info';
import UserInfo from './user-info';

export default class ServerInfo {
	/*
	 * TODO: Make globally configurable defaults
	 * The ServInfo object:
	 * userInfo: A UserInfo object (required)
	 * name: The server name (required)
	 * host: The server's host (required)
	 * port: The server's port (required)
	 * pass: The server's password (default to null)
	 * tls: Whether to use TLS (default to true, but depends on the port)
	 * encoding: The server's supported encoding (default to 'utf8')
	 * channels: The channels to join (default to [])
	 * channelRestrictions: Channels and their minimum mode (default to {})
	 * regUser: Your registration username, unused if undefined
	 * regPass: Your registration password, unused if undefined
	 * regMethod: Your preferred registration method, unused if undefined
	 * regMethod can either be nickserv, sasl or none
	 */
	constructor(servInfo) {
		// For configuration, channels make more sense in the server,
		// but placing them in a user can simplify the program.
		servInfo.userInfo.channels = servInfo.channels;
		this.ownerHost = servInfo.ownerHost;
		this.user = new UserInfo(servInfo.userInfo) || throw 'User info is required.';
		this.name = servInfo.name || throw 'Server name is required.';
		this.host = servInfo.host || throw 'Server hostname is required.';
		this.port = servInfo.port || throw 'Server port is required.';
		this.tls = this.isTLS(servInfo.tls);
		this.pass = servInfo.pass || null;
		this.encoding = servInfo.encoding || 'utf8';
		this.channelRestrictions = servInfo.channelRestrictions || {};

		// TODO: Move registration info to its own object
		// outside of ServerInfo and setup permissions
		this.regUser = servInfo.regUser;
		this.regPass = servInfo.regPass;
		this.regMethod = servInfo.regMethod;

		this._tracking = false;
		this._client = null;
		this.channels = {}; // ChannelInfo objects
		this.users = {}; // UserInfo objects
		this.users[this.user.nick] = this.user; // Add ourselves

		this._events = {
			'JOIN': this._onJoin.bind(this),
			'PART': this._onPart.bind(this),
			'QUIT': this._onQuit.bind(this),
			'NICK': this._onNick.bind(this),
			'MODE': this._onMode.bind(this),
			'352': this._onWho.bind(this),
			'353': this._onNames.bind(this),
			'TOPIC': this._onTopic.bind(this),
			'332': this._onTopic.bind(this),
		};
	}

	isTracking() {
		return this._tracking;
	}

	enableTracking(client) {
		if (this._tracking)
			return;

		this._client = client || throw 'ServerInfo.initTracking called with invalid server';
		this._tracking = true;

		Object.keys(this._events).forEach((command) => {
			this._client.hooks.add(command, this._events[command])
		});

		this._client.hooks.addClosing(this.disableTracking.bind(this));
	}

	disableTracking() {
		if (!this._tracking)
			return;

		this._client = null;
		this._tracking = false;

		// Remove the hooks that we've added.
		this._client.hooks.removeClosing(this.disableTracking.bind(this));
		Object.keys(this._events).forEach((command) => {
			this._client.hooks.remove(this._events[command])
		});

		// The data is useless now, get rid of it.
		this.channels = {};
		this.users = {};
	}

	willRegister() {
		return this.nsIdent && this.nsPass;
	}

	isTLS(tls) {
		if (tls === true || tls === false)
			return tls; 

		return this.isPortTLS();
	}

	isPortTLS() {
		const port = this.port;

		/* Error case */
		if (port == -1)
			return false;

		/*
		 * Common non-SSL IRC ports
		 * yes 7000 is ambiguous, an unencrypted connection will
		 * be used as fallback if TLS fails (the user will be warned),
		 * so might as well try.
		 */
		if (port == 194)
			return false;
		/* Common SSL IRC ports */
		if (port == 994 || port == 7000 || port == 7070)
			return true;

		/* False for 6660-6669 */
		for (let i = 6660; i <= 6669; i++)
			if (port == i)
				return false;

		/* True for 6690-6699 */
		for (let i = 6690; i <= 6699; i++)
			if (port == i)
				return true;

		/* True for 9990-9999 */
		for (let i = 9990; i <= 9999; i++)
			if (port == i)
				return true;

		/* Default to true */
		console.warn('TLS unspecified and couldn\'t guess from port, defaulting to true');
		return true;
	}

	_uinfoFromMsgData(msgData) {
		return new UserInfo({
			ident: msgData.ident,
			nick: msgData.nick,
			host: msgData.host,
			// We don't know the realname yet
		});
	}

	_getModes(modes, changes) {
		let addSwitch = false;

		for (let i = 0; i < changes.length; i++) {
			let c = changes[i];
			switch (c) {
			case '+':
				addSwitch = true;
				break;
			case '-':
				addSwitch = false;
				break;
			default:
				if (addSwitch) {
					if (!modes.includes(c)) {
						modes.push(c);
					}
				} else {
					modes = modes.filter(mode => mode !== c);
				}
			}
		}

		return modes;
	}

	// TODO: Create a helper class to parse modes
	_changeModes(nick, channel, changes) {
		var modes;
		// Some other user in a channel
		if (this.users[nick] && typeof this.users[nick].channels[channel] === 'string')
			modes = this.users[nick].channels[channel].split('');
		// Us
		else if (nick === channel)
			modes = this.user.modes.split('');
		// Untracked user
		else
			modes = [];

		// Make sure the user exists
		if (!(this.users[nick] instanceof UserInfo)) {
			this.users[nick] = new UserInfo({
				nick: nick,
			});
		}

		// Make sure the channel exists
		if (!(this.channels[channel] instanceof ChannelInfo))
			this.channels[channel] = new ChannelInfo(channel);

		// Parse the changes, add to modes, handle duplicates
		let modeString = this._getModes(modes, changes)
			.filter((elem, index, self) => self.indexOf(elem) === index)
			.sort()
			.join('');

		if (nick === channel) {
			this.user.modes = modeString;
		} else {
			this.users[nick].channels[channel] = modeString;
			this.channels[channel].users[nick] = modeString;
		}
	}

	_parseStatus(nick, channel, status) {
		let chars = status.split('');
		let user = this.users[nick];
		let modes = [];
		chars.forEach((c) => {
			switch(c) {
			case 'G':
				user.away = true;
				break;
			case 'H':
				user.away = false;
				break;
			case '*':
				user.oper = true;
				break;
			// The following are in order of power,
			// they inherit from the ones below.
			case '!': // Oper on official business
				modes.push('Y');
				break;
			case '~':
				modes.push('q');
				break;
			case '&':
				modes.push('a');
				break;
			case '@':
				modes.push('o');
				break;
			case '%':
				modes.push('h');
				break;
			case '+':
				modes.push('v');
				break;
			}
		});

		// _changeModes will take care of duplicates.
		let changes = '+' + modes.sort().join('');
		this._changeModes(nick, channel, changes);
	}

	// TODO: The functions below are pretty much a rewrite of vini, verify them.
	// TODO: This needs to be less messy.

	_onJoin(client, msgData) {
		let chan = msgData.tail;
		let nick = msgData.nick;

		if (nick === this.user.nick) {
			this.channels[chan] = new ChannelInfo(chan);
			this.channels[chan].users[nick] = '';
			this.user.channels[chan] = '';

			// We've just joined this channel, call WHO
			client.writer.sendCommand('WHO', chan);
		}

		// Add the user if they're new
		if (!(this.users[nick] instanceof UserInfo))
			this.users[nick] = this._uinfoFromMsgData(msgData);

		// Set an empty modestring for now
		this.users[nick].channels[chan] = '';
		this.channels[chan].users[nick] = '';
	}

	_onPart(client, msgData) {
		let chan = msgData.tail;
		let nick = msgData.nick;

		if (nick === this.user.nick) {
			delete this.channels[chan];
			delete this.user.channels[chan];

			// Delete this channel from every user
			Object.keys(this.users).forEach((user) => {
				let chans = this.users[user].channels;
				if (typeof chans[chan] === 'string') {
					// Delete the user if there are no more common channels
					if (Object.keys(chans) === 1)
						delete this.users[user];
					else
						delete this.users[user].channels[chan];
				}
			});
		} else {
			delete this.users[nick].channels[chan];
			delete this.channels[chan].users[nick];

			// Delete the user if we don't have more common channels
			if (Object.keys(this.users[nick].channels).length === 0)
				delete this.users[nick];
		}
	}

	_onQuit(client, msgData) {
		let nick = msgData.nick;
		if (nick === this.user.nick)
			// The socket will be closed, no need to do anything.
			return;

		// Delete this user everywhere
		delete this.users[nick];
		Object.keys(this.channels).forEach((chan) => {
			if (typeof this.channels[chan].users[nick] === 'string')
				delete this.channels[chan].users[nick];
		});
	}

	_onNick(client, msgData) {
		let nick = msgData.nick;
		let newNick = msgData.params[0];

		if (nick === this.user.nick)
			this.user.nick = newNick;

		// Change the nick or create the user if it doesn't exist
		if (this.users[nick] instanceof UserInfo) {
			this.users[nick].nick = newNick;
			this.users[newNick] = this.users[nick];
			delete this.users[nick];
		} else {
			this.users[nick] = this._uinfoFromMsgData(msgData);
		}

		// Replace the old entry in every channel
		Object.keys(this.channels).forEach((chan) => {
			let modeString = this.channels[chan].users[nick] || '';
			this.channels[chan].users[newNick] = modeString;
			delete this.channels[chan].users[nick];
		});
	}

	_onMode(client, msgData) {
		let chan = msgData.params[0];
		let changes = msgData.params[1];
		let target = msgData.params[2];
		if (typeof target !== 'string') // It's a server mode
			target = chan;

		if (!(this.users[target] instanceof UserInfo)) {
			this.users[target] = new UserInfo({
				nick: target,
			});
		}

		this._changeModes(target, chan, changes);
	}

	_onWho(client, msgData) {
		let chan = msgData.params[1];
		let status = msgData.params[6];
		let match = msgData.tail.match(/^\d+?\s+?(.+)$/);
		if (!match)
			return;

		let user = {
			realname: match[1],
			ident: msgData.params[2],
			host: msgData.params[3],
			server: msgData.params[4],
			nick: msgData.params[5],
			channels: [chan],
		};

		if (this.users[user.nick] instanceof UserInfo)
			this.users[user.nick].update(user);
		else
			this.users[user.nick] = new UserInfo(user);

		this._parseStatus(user.nick, chan, status);
	}

	_onNames(client, msgData) {
		let chan = msgData.params[msgData.params.length - 2];
		let names = msgData.tailWords;
		let validStatus = '!~&@%+'.split('');

		names.forEach((name) => {
			let nick = name;
			let status = '';
			while (validStatus.includes(nick[0])) {
				status += nick[0];
				nick = nick.slice(1);
			}

			this._parseStatus(nick, chan, status);
		});
	}

	_onTopic(client, msgData) {
		let chan = msgData.params[msgData.params.length - 2];
		let topic = msgData.tail;

		if (!(this.channels[chan] instanceof ChannelInfo))
			this.channels[chan] = new ChannelInfo(chan);

		this.channels[chan].topic = topic;
	}
}
