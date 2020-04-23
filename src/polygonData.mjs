import AttributeTypes from "./attributeTypes.mjs";
import AttributeSchema from "./attributeSchema.mjs";
import AttributeElement from "./attributeElement.mjs";
import Buffer from "./buffer.mjs";

const attributeSchema = new AttributeSchema([
    new AttributeElement("a_position", 3, AttributeTypes.FLOAT, 0, 0)
]);

export default class PolygonData {
    constructor(graphics, vertices, indices) {
        this.vertexBuffer = new Buffer(graphics, attributeSchema, vertices);
        this.indexBuffer = null;
    }
}