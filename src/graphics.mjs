import * as WebGL from "./graphics/webGL.mjs";

export default class Graphics {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl) {
        this.gl = gl;
        this.extensions = {
            "ANGLE_instanced_arrays": this.gl.getExtension("ANGLE_instanced_arrays")
        };

        this._currentProgram = null;

        WebGL.enablePremultipliedAlpha(this.gl);
    }

    clear(color) {
        WebGL.clear(this.gl, color.r, color.g, color.b, color.a);
    }

    begin(effect) {
        this._currentProgram = effect.program;
        this.gl.useProgram(this._currentProgram);
    }

    setVertexBuffer(buffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);

        for (let element of buffer.attributeSchema.elements) {
            const index = this.gl.getAttribLocation(this._currentProgram, element.name);

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

    setUniform(uniform, value) {
        const location = this.gl.getUniformLocation(this._currentProgram, uniform);
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
        for (let element of buffer.attributeSchema.elements) {
            const index = this.gl.getAttribLocation(this._currentProgram, element.name);

            if (index < 0) {
                throw new Error(`The current program does not have a(n) '${element.name}' attribute.`);
            }

            this.gl.disableVertexAttribArray(index);
        }

        this.gl.deleteBuffer(buffer.buffer);
    }

    end() {
        this._currentProgram = null;
    }
}