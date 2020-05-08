import * as WebGL from "./webGL.js";
import Buffer from "./buffer.js";
import BufferType from "./bufferType.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "./graphics.js";
// eslint-disable-next-line no-unused-vars
import AttributeSchema from "./attributeSchema.js";

export default class VertexBuffer extends Buffer {
	public readonly attributeSchema: AttributeSchema;
	public readonly vertexUsage: number;
	public readonly instanceFrequency: number;

	constructor(
		graphics: Graphics,
		attributeSchema: AttributeSchema,
		length: number,
		vertexUsage: number,
		instanceFrequency?: number
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
