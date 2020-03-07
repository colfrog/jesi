export default class ModulePermissions {
	/*
	 * The ModulePermissions object (all default to false):
	 * TODO: Extend as features are added
	 * hasServerInfo: Whether the module has access to the server info
	 * hasIRCWriter: Whether the module has access to the IRC writer
	 */
	constructor(params) {
		this.hasServerInfo = params.hasServerInfo || false;
		this.hasIRCWriter = params.hasIRCWriter || false;
	}
}
