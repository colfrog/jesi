import net from 'net';
import tls from 'tls';
import regeneratorRuntime from 'regenerator-runtime';

import Hooks from './Hooks';
import coreHooks from './coreHooks';
import MessageData from './MessageData';

export default class Server {
	constructor(info) {
		this.connected = false;
		this.info = info;

		this.hooks = new Hooks();
		// Add core hooks
		coreHooks.addTo(this);

		this.connect();
	}

	connect() {
		if (this.connected)
			return;
		this._socket = this._makeSocket();
	}

	reconnect() {
		if (this.connected)
			close();
		this._socket = this._makeSocket();
	}

	on(command, callback) {
		hooks.add(command, callback);
	}

	close() {
		if (this.connected) {
			this.hooks.runClosingHooks(this);
			this._socket.destroy();
		}
	}

	async write(data) {
		var sanitized = this._sanitize(data);
		for (let i = 0; i < sanitized.length; i++) {
			let chunk = sanitized[i] + '\r\n';
			this._socket.write(chunk, this.info.encoding, () => {
				console.log(this.info.name + ' <- ' + chunk.trim());
			});
		}
	}

	async handleMessage(msg) {
		console.log(this.info.name + ' -> ' + msg);
		let msgData = new MessageData(msg);
		msgData.parse();
		if (msgData.valid)
			this.hooks.runHooks(this, msgData);
	}

	async _onSocketData(data) {
		var chunks = this._sanitize(data);
		chunks.forEach(this.handleMessage.bind(this));
	}

	async _onSocketConnected() {
		this.connected = true;
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
		// Throw the error instead?
		this._socket = this._makeSocket();
	}

	async _onSocketEnd() {
		console.log('Disconnected from ' + this.info.name +
			'. Attempting to reconnect...');
		this.hooks.runClosingHooks(this);
		this._socket = this._makeSocket();
	}

	async _onSocketClosed(hadError) {
		this.connected = false;
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
		socket.on('close', this._onSocketClosed.bind(this));

		return socket;
	}

	/*
	 * _sanitize splits the data by message and returns a list of
	 * messages without their line breaks.
	 */
	_sanitize(data) {
		// TODO: Improve sanitation if necessary
		return data.trim().split('\r\n');
	}
}
