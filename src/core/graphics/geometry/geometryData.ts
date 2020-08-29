import * as Graphics from "../../../lib/graphics.js";

const _attributeSchema = new Graphics.AttributeSchema([
	new Graphics.AttributeElement(
		"a_vertexPosition",
		3,
		Graphics.AttributeType.FLOAT
	),
]);

export default class GeometryData {
	public readonly mesh: Graphics.Mesh;
	public readonly vertexBuffer: Graphics.VertexBuffer;
	public readonly indexBuffer: Graphics.IndexBuffer;
	public readonly totalVertices: number;
	public readonly totalTriangles: number;

	constructor(graphics: Graphics.GraphicsManager, mesh: Graphics.Mesh) {
		this.mesh = mesh;

		this.vertexBuffer = new Graphics.VertexBuffer(
			graphics,
			_attributeSchema,
			this.mesh.vertices.length,
			Graphics.VertexUsage.STATIC
		);
		this.indexBuffer = new Graphics.IndexBuffer(
			graphics,
			this.mesh.indices.length
		);

		this.totalVertices = this.mesh.totalVertices;
		this.totalTriangles = this.mesh.totalIndices / 3;

		this.vertexBuffer.setData(this.mesh.vertices);
		this.indexBuffer.setData(this.mesh.indices);

		Object.defineProperty(this, "mesh", {
			writable: false,
		});
		Object.defineProperty(this, "vertexBuffer", {
			writable: false,
		});
		Object.defineProperty(this, "indexBuffer", {
			writable: false,
		});
		Object.defineProperty(this, "totalVertices", {
			writable: false,
		});
		Object.defineProperty(this, "totalTriangles", {
			writable: false,
		});
	}
}
