var __classPrivateFieldSet =
	(this && this.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet =
	(this && this.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _graphics;
import * as WebGL from "./webGL.js";
import BufferType from "./bufferType.js";
export default class Buffer {
	constructor(graphics, length, type) {
		_graphics.set(this, void 0);
		this.length = length;
		this.type = type;
		__classPrivateFieldSet(this, _graphics, graphics);
		this.data = null;
		this.buffer = null;
		Object.defineProperty(this, "length", {
			writable: false,
		});
		Object.defineProperty(this, "type", {
			writable: false,
		});
	}
	setData(data) {
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
			case BufferType.VERTEX: {
				WebGL.setVertexBufferData(
					__classPrivateFieldGet(this, _graphics).gl,
					this.buffer,
					this.data
				);
				break;
			}
			case BufferType.INDEX: {
				WebGL.setIndexBufferData(
					__classPrivateFieldGet(this, _graphics).gl,
					this.buffer,
					this.data
				);
				break;
			}
			default: {
				throw new TypeError(`'${this.type}' is an invalid BufferType.`);
			}
		}
	}
}
_graphics = new WeakMap();
