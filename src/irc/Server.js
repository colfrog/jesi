import net from 'net';
import tls from 'tls';
import regeneratorRuntime from 'regenerator-runtime';

export default class Server {
	constructor(serverName, hostName, port, TLS) {
		this.name = serverName;
		this.host = hostName;
		this.port = port;
		this.TLS = this.isTLS(port, tls);
		this.socket = this.makeSocket();
	}

	async onSocketData(data) {
		console.log(this.name + ' (' + data.length + ' bytes): ' + data.trim());
	}

	async onDeadSocket() {
		this.socket = this.makeSocket();
	}

	makeSocket() {
		console.log("Connection to server " + this.name + " on " + this.host + ":" + this.port);
		var socket = net.connect({
			host: this.host,
			port: this.port
		});

		if (this.tls) {
			socket = tls.connect({
				host: this.host,
				port: this.port,
				socket: socket
			});
		}

		socket.setEncoding('utf8');
		socket.on('data', this.onSocketData.bind(this));
		socket.on('end', this.onDeadSocket.bind(this));

		return socket;
	}

	isTLS(port, TLS) {
		if (TLS === true || TLS === false)
			return TLS;

		return this.isPortTLS(port);
	}

	isPortTLS(port) {
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
