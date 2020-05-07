import * as WebGL from "./webGL.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "./graphics.js";
import BufferType from "./bufferType.js";

export default class Buffer {
	public readonly length: number;
	public readonly type: number;
	public buffer: WebGLBuffer | null;
	
	protected data: Float32Array | Int16Array | null;

	readonly #graphics: Graphics;

	constructor(graphics: Graphics, length: number, type: number) {
		this.length = length;
		this.type = type;

		this.#graphics = graphics;

		this.data = null;
		this.buffer = null;
	}

	setData(data: number[]) {
		if (this.data === null || this.buffer == null) {
			throw new Error();
		}

		if (data.length != this.length) {
			throw new TypeError(
				`Expected an array with ${this.length} element(s). Received an array with ${data.length} element(s) instead.`
			);
		}

		this.data.set(data);

		switch (this.type) {
			case BufferType.VERTEX:
				WebGL.setVertexBufferData(this.#graphics.gl, this.buffer, this.data);
				break;
			case BufferType.INDEX:
				WebGL.setIndexBufferData(this.#graphics.gl, this.buffer, this.data);
				break;
			default:
				throw new TypeError(`'${this.type}' is an invalid BufferType.`);
		}
	}
}
