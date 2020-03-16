export default class ChannelInfo {
	constructor(name) {
		this.name = name || throw 'Channel name is required in ChannelInfo.';
		this.topic = '';
		this.users = {};
	}
}
