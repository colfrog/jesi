var jModule = {
	name: 'Module Manager',
	description: 'Commands to manage modules from IRC',
	core: true
};

// TODO: Report back on failure

function doLoad(msgData) {
	let target = msgData.nick;
	if (msgData.host !== serverInfo.ownerHost)
		return ircWriter.sendMessage(target, 'no.');

	let path = msgData.tailWords.slice(1).join(' ');
	modHandler.addModule(path);
	ircWriter.sendNotice(target, `Attempting to load ${path}`);
}

function doReload(msgData) {
	let target = msgData.nick;
	if (msgData.host !== serverInfo.ownerHost)
		return ircWriter.sendMessage(target, 'no.');

	let module = msgData.tailWords.slice(1).join(' ');
	if (module === 'all') {
		modHandler.refreshAll();
		ircWriter.sendNotice(target, 'All modules were reloaded.');
	} else {
		modHandler.refresh(module);
		ircWriter.sendNotice(target, `Attempting to reload ${module}`);
	}
}

function doUnload(msgData) {
	let target = msgData.nick;
	if (msgData.host !== serverInfo.ownerHost)
		return ircWriter.sendMessage(target, 'no.');

	let module = msgData.tailWords.slice(1).join(' ');
	modHandler.delModule(module);
	ircWriter.sendNotice(target, `Attempting to unload ${module}`);
}

addCommand('load', 'doLoad');
addCommand('reload', 'doReload');
addCommand('unload', 'doUnload');
