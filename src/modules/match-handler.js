export default class MatchHandler {
	constructor(module) {
		this.module = module || throw 'Module not given to match handler.';
		this.patterns = {};
	}
	
	run(msgData) {
		let text = msgData.tail;
		Object.keys(this.patterns).forEach(pattern => {
			console.log(pattern);
			console.log(text);
			let match = pattern.match(text);
			console.log(match);
			if (match) {
				this.patterns[pattern].forEach(code => {
					this.module.run(code, msgData);
				});
			}
		});
	}

	add(pattern, code, compileOptions) {
		const re = new RegExp(pattern, compileOptions);
		if (this.patterns[re])
			this.patterns[re].push(code);
		else
			this.patterns[re] = [code];
	}

	del(pattern, code) {
		// TODO: A more complex structure is needed if we want to delete entries
	}
}
