import * as WebGL from "./webGL.mjs";
import Buffer from "./buffer.mjs";
import BufferType from "./bufferType.mjs";
import VertexUsage from "./vertexUsage.mjs";

export default class VertexBuffer extends Buffer {
    constructor(graphics, attributeSchema, length, vertexUsage, instanceFrequency) {
        super(graphics, length, BufferType.VERTEX);

        this.attributeSchema = attributeSchema;
        this.vertexUsage = vertexUsage ? vertexUsage : VertexUsage.STATIC;
        this.instanceFrequency = instanceFrequency ? instanceFrequency : 0;

        this.data = new Float32Array(this.length);
        this.buffer = WebGL.allocateVertexBuffer(graphics.gl, this.data.byteLength, this.vertexUsage);
    }
}