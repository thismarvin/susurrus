import AttributeType from "./attributeType.mjs";
import AttributeSchema from "./attributeSchema.mjs";
import AttributeElement from "./attributeElement.mjs";
import VertexUsage from "./vertexUsage.mjs";
import VertexBuffer from "./vertexBuffer.mjs";
import IndexBuffer from "./indexBuffer.mjs";

const attributeSchema = new AttributeSchema([
	new AttributeElement("a_position", 3, AttributeType.FLOAT),
]);

export default class PolygonData {
	//#region Class Properties
	// public:
	// =======================
	// vertexBuffer; // readonly
	// indexBuffer; // readonly
	// totalVertices; // readonly
	// totalTriangles; // readonly
	//#endregion

	constructor(graphics, vertices, indices) {
		Object.defineProperty(this, "vertexBuffer", {
			value: new VertexBuffer(
				graphics,
				attributeSchema,
				vertices.length,
				VertexUsage.STATIC
			),
			writable: false,
		});

		Object.defineProperty(this, "indexBuffer", {
			value: new IndexBuffer(graphics, indices.length),
			writable: false,
		});

		Object.defineProperty(this, "totalVertices", {
			value: vertices.length / 3,
			writable: false,
		});

		Object.defineProperty(this, "totalTriangles", {
			value: indices.length / 3,
			writable: false,
		});

		this.vertexBuffer.setData(vertices);
		this.indexBuffer.setData(indices);
	}
}
