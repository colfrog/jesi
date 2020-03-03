export default class MessageData {
	constructor(data) {
		this.raw = data;
		this.command = '';
		this.params = [];
		this.tail = '';
		this.tags = {};
	}
}
