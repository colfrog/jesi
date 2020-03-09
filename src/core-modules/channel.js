function joinChannels(msgData) {
	let channels = serverInfo.user.channelNames;
	if (channels.length > 0)
		ircWriter.joinChannels(channels);
}

function onInvite(msgData) {
	ircWriter.sendCommand('JOIN', msgData.tail);
}

addHook('INVITE', 'onInvite');
addPostInit('joinChannels');
addHook('900', 'joinChannels'); // Reattempt after being registered
