import IRC3Tag from './irc3-tag';

export default class MessageData {
	constructor(data) {
		this.valid = false;
		if (typeof data !== 'string') {
			this.raw = '';
			return;
		}

		// Raw data
		this.raw = data;

		// Message parts
		this.prefix = '';
		this.command = '';
		this.params = [];
		this.tail = '';
		this.tailWords = [];
		this.tags = {};

		// Nick, ident, host from messages and notices
		// TODO: Maybe reference the UserInfo when we'll keep a user list
		this.fromUser = false;
		this.nick = '';
		this.ident = '';
		this.host = '';
	}

	isWordValid(word) {
		// TODO: Add more checks
		return typeof word === 'string' && word.length > 0;
	}

	getCommandIndex(words) {
		// Just take the first all-caps word for now
		for (let i = 0; i < words.length; i++) {
			let match = words[i].match(/[A-Z|0-9]/g);
			if (match && match.length === words[i].length)
				return i;
		}
	}

	parse() {
		if (!this.raw || this.raw.length === 0)
			return;

		const words = this.raw
			.trim()
			.split(' ')
			.filter(this.isWordValid);

		let cmdIndex = this.getCommandIndex(words);
		this._parsePrefix(words, cmdIndex),
		this._parseTags(words, cmdIndex),
		this._parseCommand(words, cmdIndex),
		this._parseParamsAndTail(words, cmdIndex)

		if ((typeof this.command === 'string' &&
		     typeof this.params === 'object' &&
		     typeof this.tail === 'string') ||
		    (this.command.length > 0 &&
		     this.params.length > 0 &&
		     this.tail.length > 0))
			this.valid = true;
	}

	_parsePrefix(words, cmdIndex) {
		if (cmdIndex > 0)
			this.prefix = words[cmdIndex - 1].slice(1);

		const prefix = this.prefix;
		// TODO: improve the regex
		const match = prefix.match(/^(.+?)!(.+?)@(.+?)$/);
		if (match !== null) {
			this.fromUser = true;
			this.nick = match[1];
			this.ident = match[2];
			this.host = match[3];
		}
	}

	_parseTag(rawTag) {
		const isClient = rawTag[0] === '+';
		const tagAndKey = rawTag.split('=');
		const vendorAndKeyName = tagAndKey.split('/');
		var tagValue = tagAndKey[0];
		if (isClient)
			tagValue = tagValue.splice(1);

		const tag = new IRC3Tag({
			tag: tagValue,
			vendor: vendorAndKeyName[0],
			keyName: vendorAndKeyName[1],
			isClient: isClient
		});
		this.tags[tagValue] = tag;
	}

	_parseTags(words, cmdIndex) {
		if (cmdIndex > 1)
			var rawTags = words[cmdIndex - 2];
		else
			return;

		if (rawTags[0] !== '@')
			return;

		tagList = rawTags.slice(1).split(';');
		tagList.forEach(this._parseTag);
	}

	_parseCommand(words, index) {
		this.command = words[index];
	}

	_parseParamsAndTail(words, cmdIndex) {
		for (var i = cmdIndex + 1; i < words.length && words[i][0] !== ':'; i++)
			this.params.push(words[i]);

		if (!words[i] || words[i][0] !== ':')
			return;

		let raw = this.raw;
		let tail = raw.slice(raw.indexOf(words[i]) + 1).trim();
		this.params.push(tail);
		this.tail = tail;
		this.tailWords = tail.split(' ').filter(word => word.length > 0);
	}
}
