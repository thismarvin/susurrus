export default class InputMapping {
	public name: string;
	public keys: string;

	constructor(name: string, keys: string) {
		this.name = name;
		this.keys = keys;
	}

	public remap(keys: string) {
		this.keys = keys;
	}
}
