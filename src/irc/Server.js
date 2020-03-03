import net from 'net';
import tls from 'tls';
import regeneratorRuntime from 'regenerator-runtime';

import Hooks from './Hooks';
import MessageData from './MessageData';

export default class Server {
	constructor(info, user) {
		this.info = info;
		this.user = user;
		this.hooks = new Hooks();
		this._socket = this._makeSocket();
	}

	close() {
		this.hooks.runClosingHooks(this);
		this._socket.destroy();
	}

	async write(data) {
		var sanitized = this._sanitize(data);
		for (let i = 0; i < sanitized.length; i++) {
			let chunk = sanitized[i];
			this._socket.write(chunk, this.info.encoding, () => {
				console.log(this.info.name + ' <- ' + data.trim() + '\r\n');
			});
		}
	}

	async _onSocketData(data) {
		console.log(this.info.name + ' -> ' + data.trim());
		const msgData = new MessageData(data);
		this.hooks.runHooks(this, msgData);
	}

	async _onSocketConnected() {
		console.log('Connected to ' + this.info.name);
		console.log('Running pre-init hooks');
		this.hooks.runPreInitHooks(this);
	}

	async _onSocketError(error) {
		console.log('Connection error to ' + this.info.name + ': ' + error);
		console.log('Retrying...');

		/*
		 * I'm retrying here under the assumption that only either
		 * end or error can be called, since a socket error prevents
		 * the FIN packet from being received.
		 */
		this._socket = this._makeSocket();
		// TODO: Eventually we'll throw the error
	}

	async _onSocketEnd() {
		console.log('Disconnected from ' + this.info.name +
			'. Attempting to reconnect...');
		this.hooks.runClosingHooks(this);
		this._socket = this._makeSocket();
	}

	_makeSocket() {
		console.log(
			'Connecting to server ' + this.info.name +
			' on ' + this.info.host +
			':' + this.info.port +
			' (TLS = ' + this.info.tls + ')'
		);

		var socket = net.connect({
			host: this.info.host,
			port: this.info.port
		});

		if (this.info.tls) {
			console.log('Establishing TLS connection...');
			socket = tls.connect({
				host: this.info.host,
				port: this.info.port,
				socket: socket
			});
		}

		socket.setEncoding(this.info.encoding);
		socket.on('data', this._onSocketData.bind(this));
		socket.on('connect', this._onSocketConnected.bind(this));
		socket.on('error', this._onSocketError.bind(this));
		socket.on('end', this._onSocketEnd.bind(this));

		return socket;
	}

	/*
	 * TODO: _sanitize will eventually separate data in a list of IRC-writable
	 * chunks and return that list. For now only basic sanitization is done.
	 */
	_sanitize(data) {
		// TODO: Improve write sanitization
		var sanitized = [data.trim() + '\r\n'];
		return sanitized;
	}
}
