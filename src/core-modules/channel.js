function joinChannels(msgData) {
	let channels = Object.keys(serverInfo.user.channels);
	if (channels.length > 0)
		ircWriter.joinChannels(channels);
}

function onInvite(msgData) {
	ircWriter.sendCommand('JOIN', msgData.tail);
}

addHook('INVITE', 'onInvite');
addPostInit('joinChannels');
addHook('900', 'joinChannels'); // Reattempt after being registered
