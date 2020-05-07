import * as WebGL from "./webGL.mjs";
import Buffer from "./buffer.mjs";
import BufferType from "./bufferType.mjs";

export default class IndexBuffer extends Buffer {
	constructor(graphics, length) {
		super(graphics, length, BufferType.INDEX);

		this.data = new Int16Array(this.length);
		this.buffer = WebGL.allocateIndexBuffer(graphics.gl, this.data.byteLength);
	}
}
