import net from 'net';
import tls from 'tls';
import regeneratorRuntime from 'regenerator-runtime';

import Hooks from './hooks';
import CapabilityNegociator from './capability-negociator';
import MessageData from '../proto/message-data';
import ServerInfo from '../proto/server-info';
import IRCWriter from './irc-writer';

export default class Client {
	constructor(info) {
		this.connected = false;
		this.info = new ServerInfo(info);
		this.writer = new IRCWriter(this);

		this.hooks = new Hooks();
		this.capNegociator = new CapabilityNegociator(this);
	}

	async connect() {
		if (this.connected)
			return;

		this._socket = this._makeSocket();
	}

	async reconnect() {
		if (this.connected)
			close();

		this._socket = this._makeSocket();
	}

	on(command, callback) {
		hooks.add(command, callback);
	}

	close() {
		if (this.connected) {
			this.hooks.runClosing(this);
			this._socket.destroy();
		}
	}

	async write(data) {
		// Data is not checked for correctness because Client.write
		// should not be used outside of IRCWriter.
		this._socket.write(data, this.info.encoding, () => {
			console.log(this.info.name + ' <-- ' + data.trim());
		});
	}

	async handleMessage(msg) {
		console.log(this.info.name + ' --> ' + msg);
		let msgData = new MessageData(msg);
		msgData.parse();
		if (msgData.valid)
			this.hooks.runCommand(this, msgData);
	}

	async _onSocketData(data) {
		const msgs = this._splitMessages(data);
		msgs.forEach(this.handleMessage.bind(this));
	}

	async _onSocketConnected() {
		this.connected = true;
		console.log('Connected to ' + this.info.name);
		this.info.enableTracking(this);
		this.hooks.runPreInit(this);
		this.capNegociator.request();
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
		this.hooks.runClosing(this);
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
			port: this.info.port,
		});

		if (this.info.tls) {
			console.log('Establishing TLS connection...');
			socket = tls.connect({
				host: this.info.host,
				port: this.info.port,
				socket: socket,
			});
		}

		socket.setNoDelay(true);
		socket.setEncoding(this.info.encoding);
		socket.on('data', this._onSocketData.bind(this));
		socket.on('connect', this._onSocketConnected.bind(this));
		socket.on('error', this._onSocketError.bind(this));
		socket.on('end', this._onSocketEnd.bind(this));
		socket.on('close', this._onSocketClosed.bind(this));

		return socket;
	}

	_splitMessages(data) {
		return data.trim().split('\r\n');
	}
}
