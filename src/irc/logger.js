import sqlite3 from 'sqlite3';

export default class Logger {
	constructor(client, dir) {
		this.servInfo = client.info;
		this.dir = dir || 'data/logs.db';
		this.db = new sqlite3.Database('data/logs.db');
		client.hooks.add('PRIVMSG', this.logMessage.bind(this));

		this.createTable = this.db.prepare(`
			CREATE TABLE IF NOT EXISTS message_logs (
				server TEXT,
				channel TEXT,
				nick TEXT,
				ident TEXT,
				host TEXT,
				message TEXT,
				is_action INTEGER,
				time INTEGER
			);
		`);
		this.createTable.run(() => {
			this.insertMessage = this.db.prepare(`
				INSERT INTO message_logs
				(server, channel, nick, ident, host, message, is_action, time)
				VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
			`);
			this.retrieveMessages = this.db.prepare(`
				SELECT * FROM message_logs
				WHERE server = ? AND channel = ?
				ORDER BY time DESC
				LIMIT ?
			`);
		});
	}

	logMessage(client, msgData) {
		let isAction = false;
		let text = msgData.tail;
		if (msgData.tail.startsWith('\x01ACTION ') && msgData.tail.endsWith('\x01')) {
			isAction = true;
			// Strip the action tags
			text = text.substring(8, text.length - 1);
		}

		this.insertMessage.run(
			client.info.name,
			msgData.params[0],
			msgData.nick,
			msgData.ident,
			msgData.host,
			text,
			isAction
		);
	}

	getLogs(channel, count, callback) {
		this.retrieveMessages.all(this.servInfo.name, channel, count, callback);
	}
}
