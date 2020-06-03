export default class Mesh {
	public readonly vertices: number[];
	public readonly indices: number[];

	constructor(vertices: number[], indices: number[]) {
		this.vertices = vertices;
		this.indices = indices;

		Object.defineProperty(this, "vertices", {
			writable: false,
		});
		Object.defineProperty(this, "indices", {
			writable: false,
		});
	}
}
