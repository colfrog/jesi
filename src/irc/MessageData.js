export default class MessageData {
	constructor(data) {
		this.valid = false;
		this.raw = data;
		this.host = '';
		this.command = '';
		this.params = [];
		this.tail = '';
		this.tags = {};
	}

	async parse() {
		const words = this.raw
			.trim()
			.split(' ')
			.filter(this.isWordValid);

		if (typeof words === 'undefined' || words == null || words.length === 0)
			return;

		let cmdIndex = this.getCommandIndex(words);
		await Promise.all([
			this.parseHost(words, cmdIndex),
			this.parseTags(words, cmdIndex),
			this.parseCommand(words, cmdIndex),
			this.parseParamsAndTail(words, cmdIndex)
		]);

		if (this.command.length > 0 && this.params.length > 0 && this.tail.length > 0)
			this.valid = true;
	}

	isWordValid(word) {
		// TODO: Add more checks
		return typeof word !== 'undefined' && word !== null && word.length > 0;
	}

	getCommandIndex(words) {
		// Just take the first all-caps word for now
		for (let i = 0; i < words.length; i++) {
			let match = words[i].match(/[A-Z|0-9]/g);
			if (match !== null && match.length === words[i].length)
				return i;
		}
	}

	// TODO: These algorithms should be improved as needed

	async parseHost(words, cmdIndex) {
		if (cmdIndex > 0)
			this.host = words[cmdIndex - 1];
	}

	async parseTags(words, cmdIndex) {
		if (cmdIndex > 1)
			var raw_tags = words[cmdIndex - 2];
	}

	async parseCommand(words, index) {
		this.command = words[index];
	}

	async parseParamsAndTail(words, cmdIndex) {
		for (var i = cmdIndex + 1; i < words.length && words[i][0] != ':'; i++)
			this.params.push(words[i]);

		let raw = this.raw;
		let tail = raw.slice(raw.indexOf(words[i]) + 1).trim();
		this.params.push(tail);
		this.tail = tail;
	}
}
