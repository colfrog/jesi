var jModule = {
	name: 'Hot Reload',
	description: 'Hot reload modules',
	core: true
};

function doReload(msgData) {
	let target = msgData.replyTarget;
	if (msgData.host !== serverInfo.ownerHost)
		return ircWriter.sendMessage(target, 'no.');

	let module = msgData.tailWords.slice(1).join(' ');
	if (module === 'all') {
		modHandler.refreshAll();
		ircWriter.sendNotice(target, 'All modules were reloaded.');
	} else {
		modHandler.refresh(module);
		ircWriter.sendNotice(target, `Module ${module} was reloaded.`);
	}
}

addCommand('reload', 'doReload');