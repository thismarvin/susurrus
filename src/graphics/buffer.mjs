import * as WebGL from "./webGL.mjs";
import BufferType from "./bufferType.mjs";

export default class Buffer {
    constructor(graphics, length, type) {
        this._graphics = graphics;
        this.length = length;
        this.type = type;

        this.data = null;
        this.buffer = null;
    }

    setData(data) {
        if (data.length != this.length) {
            throw new TypeError(`Expected an array with ${this.length} element(s). Received an array with ${data.length} element(s) instead.`);
        }

        this.data.set(data);

        switch (this.type) {
            case BufferType.VERTEX:
                WebGL.setVertexBufferData(this._graphics.gl, this.buffer, this.data);
                break;
            case BufferType.INDEX:
                WebGL.setIndexBufferData(this._graphics.gl, this.buffer, this.data);
                break;
            default:
                throw new TypeError(`'${this.type}' is an invalid BufferType.`);
        }
    }
}