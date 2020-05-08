import Buffer from "./buffer.js";
import Graphics from "./graphics.js";
import AttributeSchema from "./attributeSchema.js";
export default class VertexBuffer extends Buffer {
    readonly attributeSchema: AttributeSchema;
    readonly vertexUsage: number;
    readonly instanceFrequency: number;
    constructor(graphics: Graphics, attributeSchema: AttributeSchema, length: number, vertexUsage: number, instanceFrequency?: number);
}
