export default class ModulePermissions {
	/*
	 * The ModulePermissions object (all default to `core`):
	 * TODO: Extend as features are added
	 * hasServerInfo: Whether the module has access to the server info
	 * hasIRCWriter: Whether the module has access to the IRC writer
	 */
	constructor(core, params) {
		let obj = params || {}; // It's reasonable to not define this
		this.hasServerInfo = obj.hasServerInfo || core;
		this.hasIRCWriter = obj.hasIRCWriter || core;
	}
}
