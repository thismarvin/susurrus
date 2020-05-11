export default class AttributeElement {
	constructor(name, size, type) {
		this.name = name;
		this.size = size;
		this.type = type;
		this.stride = -1;
		this.offset = -1;
		Object.defineProperty(this, "name", {
			writable: false,
		});
		Object.defineProperty(this, "size", {
			writable: false,
		});
		Object.defineProperty(this, "type", {
			writable: false,
		});
	}
}
