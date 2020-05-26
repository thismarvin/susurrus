import AttributeType from "../attributeType.js";
import AttributeSchema from "../attributeSchema.js";
import AttributeElement from "../attributeElement.js";
import VertexUsage from "../vertexUsage.js";
import VertexBuffer from "../vertexBuffer.js";
import IndexBuffer from "../indexBuffer.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "../graphicsManager.js";
// eslint-disable-next-line no-unused-vars
import Mesh from "../mesh.js";

const ATTRIBUTE_SCHEMA = new AttributeSchema([
	new AttributeElement("a_position", 3, AttributeType.FLOAT),
]);

export default class GeometryData {
	public readonly vertexBuffer: VertexBuffer;
	public readonly indexBuffer: IndexBuffer;
	public readonly totalVertices: number;
	public readonly totalTriangles: number;

	constructor(graphics: Graphics, mesh: Mesh) {
		this.vertexBuffer = new VertexBuffer(
			graphics,
			ATTRIBUTE_SCHEMA,
			mesh.vertices.length,
			VertexUsage.STATIC
		);
		this.indexBuffer = new IndexBuffer(graphics, mesh.indices.length);
		this.totalVertices = mesh.vertices.length / 3;
		this.totalTriangles = mesh.indices.length / 3;

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
