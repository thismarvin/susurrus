import * as WebGL from "./webGL.mjs";
import Buffer from "./buffer.mjs";
import BufferType from "./bufferType.mjs";
import VertexUsage from "./vertexUsage.mjs";

export default class VertexBuffer extends Buffer {
	//#region Class Properties
	// public:
	// =======================
	// attributeSchema; // readonly
	// vertexUsage; // readonly
	// instanceFrequency; // readonly
	//#endregion

	constructor(
		graphics,
		attributeSchema,
		length,
		vertexUsage,
		instanceFrequency
	) {
		super(graphics, length, BufferType.VERTEX);

		Object.defineProperty(this, "attributeSchema", {
			value: attributeSchema,
			writable: false,
		});

		Object.defineProperty(this, "vertexUsage", {
			value: vertexUsage !== undefined ? vertexUsage : VertexUsage.STATIC,
			writable: false,
		});

		Object.defineProperty(this, "instanceFrequency", {
			value: instanceFrequency !== undefined ? instanceFrequency : 0,
			writable: false,
		});

		this.data = new Float32Array(this.length);
		this.buffer = WebGL.allocateVertexBuffer(
			graphics.gl,
			this.data.byteLength,
			this.vertexUsage
		);
	}
}
