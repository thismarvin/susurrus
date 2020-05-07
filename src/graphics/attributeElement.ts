export default class AttributeElement {
	public readonly name: string;
	public readonly size: number;
	public readonly type: number;
	public stride: number;
	public offset: number;

	constructor(name: string, size: number, type: number) {
		this.name = name;
		this.size = size;
		this.type = type;

		this.stride = -1;
		this.offset = -1;
	}
}
