import net from 'net';
import tls from 'tls';
import regeneratorRuntime from 'regenerator-runtime';

export default class server {
	constructor(server_name, host_name, port, tls) {
		this.name = server_name;
		this.host = host_name;
		this.port = port;
		this.tls = this.is_tls(port, tls);
		this.socket = this.make_socket();
	}

	async on_socket_data(data) {
		console.log(this.name + ' (' + data.length + ' bytes): ' + data.trim());
	}

	async on_dead_socket() {
		this.socket = this.make_socket();
	}

	make_socket() {
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
		socket.on('data', this.on_socket_data.bind(this));
		socket.on('end', this.on_dead_socket.bind(this));

		return socket;
	}

	is_tls(port, tls) {
		if (tls === true || tls === false)
			return tls;

		return this.is_tls_port(port);
	}

	is_tls_port(port) {
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
