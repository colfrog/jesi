export default class IRC3Tag {
	constructor(obj) {
		this.tag = obj.tag || throw 'IRC3 tag not supplied';
		this.vendor = obj.vendor || throw 'IRC3 vendor not supplied';
		this.keyName = obj.keyName || throw 'IRC3 key name not supplied';
		this.isClient = obj.isClient || false;
	}
}
