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
	 * channels: The channels to join (default to [])
	 * encoding: The server's supported encoding (default to 'utf8')
	 * nsIdent: Your NickServ identity, unused if undefined
	 * nsPass: Your NickServ password, unused if undefined
	 */
	constructor(servInfo) {
		this.user = new UserInfo(servInfo.userInfo) || throw 'User info is required.';
		this.name = servInfo.name || throw 'Server name is required.';
		this.host = servInfo.host || throw 'Server hostname is required.';
		this.port = servInfo.port || throw 'Server port is required.';
		this.tls = this.isTLS(servInfo.tls);
		this.pass = servInfo.pass || null;
		// TODO: Find a way to save channels between sessions
		this.channelNames = servInfo.channels || [];
		this.encoding = servInfo.encoding || 'utf8';
		this.nsIdent = servInfo.nsIdent;
		// TODO: secure the password?
		this.nsPass = servInfo.nsPass;

		// TODO: Add SASL info and work towards supporting it
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
}
