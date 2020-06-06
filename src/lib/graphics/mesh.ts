export default class Mesh {
	public readonly vertices: number[];
	public readonly indices: number[];

	public get totalVertices() {
		return this.vertices.length / 3;
	}

	public get totalIndices() {
		return this.indices.length / 3;
	}

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
