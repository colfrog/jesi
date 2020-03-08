function joinChannels(msgData) {
	let channels = serverInfo.channelNames;
	if (channels.length > 0)
		ircWriter.joinChannels(channels);
}

function onInvite(msgData) {
	ircWriter.sendCommand('JOIN', msgData.tail);
}

addHook('INVITE', 'onInvite');

if (serverInfo.willRegister())
	addHook('900', 'joinChannels');
else
	addPostInit('joinChannels');
