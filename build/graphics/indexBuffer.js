import * as WebGL from "./webGL.js";
import Buffer from "./buffer.js";
import BufferType from "./bufferType.js";
export default class IndexBuffer extends Buffer {
	constructor(graphics, length) {
		super(graphics, length, BufferType.INDEX);
		this.data = new Int16Array(this.length);
		this.buffer = WebGL.allocateIndexBuffer(graphics.gl, this.data.byteLength);
	}
}
