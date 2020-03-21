export default class MatchHandler {
	constructor(module) {
		this.module = module || throw 'Module not given to match handler.';
		this.patterns = {};
	}
	
	run(msgData) {
		let text = msgData.tail;
		Object.keys(this.patterns).forEach(pattern => {
			let regex = this.patterns[pattern][0];
			let code = this.patterns[pattern][1];
			let match = text.match(regex);
			if (match)
				this.module.run(code, msgData);
		});
	}

	add(pattern, code) {
		// We use a pair so that we don't have to convert
		// compiled regex to strings
		const pair = [pattern, code];
		// TODO: Stop assuming that two regex will never be the same.
		this.patterns[pattern] = pair;
	}

	del(pattern, code) {
		if (this.patterns[pattern])
			delete this.patterns[pattern];
	}
}
