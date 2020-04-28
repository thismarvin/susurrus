import VertexUsage from "./vertexUsage.mjs";

export default class VertexBuffer {
    constructor(graphics, attributeSchema, length, vertexUsage, instanceFrequency) {
        this.attributeSchema = attributeSchema;
        this.length = length;
        this.vertexUsage = vertexUsage ? vertexUsage : VertexUsage.STATIC;

        this.data = new Float32Array(this.length);
        this.buffer = graphics.allocateVertexBuffer(this.data.byteLength, this.vertexUsage);
        this.instanceFrequency = instanceFrequency ? instanceFrequency : 0;

        // Not a huge fan of having this as a reference... but whatever. ¯\_(ツ)_/¯
        this._graphics = graphics;
    }

    setData(data) {
        if (data.length != this.length) {
            throw new TypeError(`Expected an array with ${this.length} element(s). Received an array with ${data.length} element(s) instead.`);
        }

        this.data.set(data);

        this._graphics.setVertexBufferData(this.buffer, this.data);
    }
}