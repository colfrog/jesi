export default class ServerInfo {
	/*
	 * TODO: Make globally configurable defaults
	 * The servInfo object:
	 * name: The server name (default to '')
	 * host: The server's host (default to '')
	 * port: The server's port (default to -1)
	 * pass: The server's password (default to null)
	 * tls: Whether to use TLS (default to true, but depends on the port)
	 * initialChannels: The initial channels to join (default to [])
	 * encoding: The server's supported encoding (default to 'utf8')
	 */
	constructor(servInfo) {
		this.name = servInfo.name || '';
		this.host = servInfo.host || '';
		this.port = servInfo.port || -1;
		this.tls = this.isTLS(servInfo.tls);
		this.pass = servInfo.pass || null;
		// TODO: Find a way to save channels between sessions
		this.channels = servInfo.initialChannels;
		this.encoding = servInfo.encoding || 'utf8';
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
