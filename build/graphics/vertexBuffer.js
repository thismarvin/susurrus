import * as WebGL from "./webGL.js";
import Buffer from "./buffer.js";
import BufferType from "./bufferType.js";
export default class VertexBuffer extends Buffer {
	constructor(
		graphics,
		attributeSchema,
		length,
		vertexUsage,
		instanceFrequency
	) {
		super(graphics, length, BufferType.VERTEX);
		this.attributeSchema = attributeSchema;
		this.vertexUsage = vertexUsage;
		this.instanceFrequency = instanceFrequency ? instanceFrequency : 0;
		this.data = new Float32Array(this.length);
		this.buffer = WebGL.allocateVertexBuffer(
			graphics.gl,
			this.data.byteLength,
			this.vertexUsage
		);
		Object.defineProperty(this, "attributeSchema", {
			writable: false,
		});
		Object.defineProperty(this, "vertexUsage", {
			writable: false,
		});
		Object.defineProperty(this, "instanceFrequency", {
			writable: false,
		});
	}
}
