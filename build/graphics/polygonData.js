import AttributeType from "./attributeType.js";
import AttributeSchema from "./attributeSchema.js";
import AttributeElement from "./attributeElement.js";
import VertexUsage from "./vertexUsage.js";
import VertexBuffer from "./vertexBuffer.js";
import IndexBuffer from "./indexBuffer.js";
const attributeSchema = new AttributeSchema([
	new AttributeElement("a_position", 3, AttributeType.FLOAT),
]);
export default class PolygonData {
	constructor(graphics, vertices, indices) {
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
