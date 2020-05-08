var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _currentProgram;
import * as WebGL from "./webGL.js";
import * as PropertyAssent from "../utilities/propertyAssent.js";
import Color from "./color.js";
import VertexBuffer from "./vertexBuffer.js";
export default class Graphics {
    constructor(gl) {
        _currentProgram.set(this, void 0);
        this.gl = gl;
        this.extensions = {
            ANGLE_instanced_arrays: this.gl.getExtension("ANGLE_instanced_arrays"),
        };
        __classPrivateFieldSet(this, _currentProgram, null);
        WebGL.enablePremultipliedAlpha(this.gl);
        Object.defineProperty(this, "gl", {
            writable: false,
        });
        Object.defineProperty(this, "extensions", {
            writable: false,
        });
    }
    clear(color) {
        PropertyAssent.expectInstance(color, Color);
        WebGL.clear(this.gl, color.r, color.g, color.b, color.a);
    }
    begin(effect) {
        __classPrivateFieldSet(this, _currentProgram, effect.program);
        this.gl.useProgram(__classPrivateFieldGet(this, _currentProgram));
    }
    setVertexBuffer(buffer) {
        if (__classPrivateFieldGet(this, _currentProgram) === null) {
            throw new Error("'begin(effect)' must be called before setting a VertexBuffer.");
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
        for (let element of buffer.attributeSchema.elements) {
            const index = this.gl.getAttribLocation(__classPrivateFieldGet(this, _currentProgram), element.name);
            if (index < 0) {
                throw new Error(`The current program does not have a(n) '${element.name}' attribute.`);
            }
            this.gl.enableVertexAttribArray(index);
            this.gl.vertexAttribPointer(index, element.size, element.type, false, element.stride, element.offset);
            if (buffer.instanceFrequency > 0) {
                this.extensions["ANGLE_instanced_arrays"].vertexAttribDivisorANGLE(index, buffer.instanceFrequency);
            }
        }
    }
    setVertexBuffers(buffers) {
        for (let buffer of buffers) {
            this.setVertexBuffer(buffer);
        }
    }
    setIndexBuffer(buffer) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer.buffer);
    }
    // ! This literally only works for setting the wvp matrix... 😞
    // TODO: implement like a giant switch for all possible uniforms???
    setUniform(uniform, value) {
        if (__classPrivateFieldGet(this, _currentProgram) === null) {
            throw new Error("'begin(effect)' must be called before setting a uniform.");
        }
        const location = this.gl.getUniformLocation(__classPrivateFieldGet(this, _currentProgram), uniform);
        this.gl.uniformMatrix4fv(location, false, value);
    }
    drawArrays(mode, offset, primitiveCount) {
        this.gl.drawArrays(mode, offset, primitiveCount);
    }
    drawElements(mode, totalTriangles, offset) {
        this.gl.drawElements(mode, totalTriangles * 3, this.gl.UNSIGNED_SHORT, offset);
    }
    drawInstancedElements(mode, totalTriangles, offset, primitiveCount) {
        this.extensions["ANGLE_instanced_arrays"].drawElementsInstancedANGLE(mode, totalTriangles * 3, this.gl.UNSIGNED_SHORT, offset, primitiveCount);
    }
    deleteBuffer(buffer) {
        if (__classPrivateFieldGet(this, _currentProgram) === null) {
            throw new Error("'begin(effect)' must be called before deleting a Buffer.");
        }
        if (PropertyAssent.expectInstance(buffer, VertexBuffer, {
            throwError: false,
        })) {
            const bufferVertexBuffer = buffer;
            for (let element of bufferVertexBuffer.attributeSchema.elements) {
                const index = this.gl.getAttribLocation(__classPrivateFieldGet(this, _currentProgram), element.name);
                if (index < 0) {
                    throw new Error(`The current program does not have a(n) '${element.name}' attribute.`);
                }
                this.gl.disableVertexAttribArray(index);
            }
        }
        this.gl.deleteBuffer(buffer.buffer);
    }
    end() {
        __classPrivateFieldSet(this, _currentProgram, null);
    }
}
_currentProgram = new WeakMap();
