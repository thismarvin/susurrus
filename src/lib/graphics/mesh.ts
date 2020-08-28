export default class Mesh {
	public readonly vertices: number[];
	public readonly indices: number[];
	public readonly totalVertices: number;
	public readonly totalIndices: number;

	constructor(vertices: number[], indices: number[]) {
		this.vertices = vertices;
		this.indices = indices;
		// Should i force the end user to use vertices with 3 parts?? How can i get around this!
		this.totalVertices = vertices.length / 3;
		this.totalIndices = indices.length;

		Object.defineProperty(this, "vertices", {
			writable: false,
		});
		Object.defineProperty(this, "indices", {
			writable: false,
		});
		Object.defineProperty(this, "totalVertices", {
			writable: false,
		});
		Object.defineProperty(this, "totalIndices", {
			writable: false,
		});
	}
}
