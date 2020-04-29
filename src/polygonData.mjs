import AttributeType from "./graphics/attributeType.mjs";
import AttributeSchema from "./graphics/attributeSchema.mjs";
import AttributeElement from "./graphics/attributeElement.mjs";
import VertexUsage from "./graphics/vertexUsage.mjs";
import VertexBuffer from "./graphics/vertexBuffer.mjs";
import IndexBuffer from "./graphics/indexBuffer.mjs";

const attributeSchema = new AttributeSchema([
    new AttributeElement("a_position", 3, AttributeType.FLOAT)
]);

export default class PolygonData {
    constructor(graphics, vertices, indices) {
        this.vertexBuffer = new VertexBuffer(graphics, attributeSchema, vertices.length, VertexUsage.STATIC);
        this.vertexBuffer.setData(vertices);

        this.indexBuffer = new IndexBuffer(graphics, indices.length);
        this.indexBuffer.setData(indices);

        this.totalVertices = vertices.length / 3;
        this.totalTriangles = indices.length / 3;
    }
}