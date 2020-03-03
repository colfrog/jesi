export default class MessageData {
	constructor(data) {
		this.raw = data;
		this.command = '';
		this.params = [];
		this.tail = '';
		this.tags = {};

		// TODO: Parse the data to fill in the attributes
	}
}
