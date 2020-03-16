export default class ChannelInfo {
	constructor(name) {
		this.name = name;
		this.userModes = {};

		this._client = null;
	}

	initTracking(client) {
	}

	stopTracking() {
	}
}
