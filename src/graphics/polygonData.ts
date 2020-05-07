import AttributeType from "./attributeType.js";
import AttributeSchema from "./attributeSchema.js";
import AttributeElement from "./attributeElement.js";
import VertexUsage from "./vertexUsage.js";
import VertexBuffer from "./vertexBuffer.js";
import IndexBuffer from "./indexBuffer.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "./graphics.js";

const attributeSchema = new AttributeSchema([
	new AttributeElement("a_position", 3, AttributeType.FLOAT),
]);

export default class PolygonData {
	public readonly vertexBuffer: VertexBuffer;
	public readonly indexBuffer: IndexBuffer;
	public readonly totalVertices: number;
	public readonly totalTriangles: number;

	constructor(graphics: Graphics, vertices: number[], indices: number[]) {
		this.vertexBuffer = new VertexBuffer(
			graphics,
			attributeSchema,
			vertices.length,
			VertexUsage.STATIC
		);
		this.indexBuffer = new IndexBuffer(graphics, indices.length);
		this.totalVertices = vertices.length / 3;
		this.totalTriangles = indices.length / 3;

		this.vertexBuffer.setData(vertices);
		this.indexBuffer.setData(indices);
	}
}
