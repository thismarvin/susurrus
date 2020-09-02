import * as WebGL from "./webGL.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "./graphicsManager.js";
import BufferType from "./bufferType.js";

export default abstract class Buffer {
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

		Object.defineProperty(this, "length", {
			writable: false,
		});
		Object.defineProperty(this, "type", {
			writable: false,
		});
	}

	public setData(data: number[]) {
		if (this.data === null || this.buffer === null) {
			throw new Error(
				"This buffer was not initialized correctly. Make sure the 'data' and 'buffer' properties are set.."
			);
		}

		// Do not bother doing anything if the data parameter doesn't exist.
		if (data === undefined || data === null) {
			return;
		}

		if (data.length > this.length) {
			throw new TypeError(
				`Expected an array with ${this.length} element(s) or less.`
			);
		}

		this.data.set(data);

		switch (this.type) {
			case BufferType.VERTEX: {
				WebGL.setVertexBufferData(this.#graphics.gl, this.buffer, this.data);
				break;
			}
			case BufferType.INDEX: {
				WebGL.setIndexBufferData(this.#graphics.gl, this.buffer, this.data);
				break;
			}
			default: {
				throw new TypeError(`'${this.type}' is an invalid BufferType.`);
			}
		}
	}

	public dispose() {
		this.#graphics.gl.deleteBuffer(this.buffer);
	}
}
