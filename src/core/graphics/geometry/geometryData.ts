import * as Graphics from "../../../lib/graphics.js";

const _attributeSchema = new Graphics.AttributeSchema([
	new Graphics.AttributeElement("a_position", 3, Graphics.AttributeType.FLOAT),
]);

export default class GeometryData {
	public readonly vertexBuffer: Graphics.VertexBuffer;
	public readonly indexBuffer: Graphics.IndexBuffer;
	public readonly totalVertices: number;
	public readonly totalTriangles: number;

	constructor(graphics: Graphics.GraphicsManager, mesh: Graphics.Mesh) {
		this.vertexBuffer = new Graphics.VertexBuffer(
			graphics,
			_attributeSchema,
			mesh.vertices.length,
			Graphics.VertexUsage.STATIC
		);
		this.indexBuffer = new Graphics.IndexBuffer(graphics, mesh.indices.length);
		this.totalVertices = mesh.totalVertices;
		this.totalTriangles = mesh.totalIndices;

		this.vertexBuffer.setData(mesh.vertices);
		this.indexBuffer.setData(mesh.indices);

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
