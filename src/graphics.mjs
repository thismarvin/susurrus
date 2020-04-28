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

        this.currentProgram = null;
    }


    allocateVertexBuffer(size, vertexUsage) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

        /**
         * I am not sure if I am going to keep this.
         * For some reason I cannot use DYNAMIC DRAW unless the allocated
         * size is three times the initial size???
         * STATIC_DRAW works perfectly fine with the initial size.
         * I am not even sure if DYNAMIC_DRAW is even better than STATIC_DRAW in the
         * first place.
         */
        let modifiedSize = size;
        switch (vertexUsage) {
            case (this.gl.DYNAMIC_DRAW):
                modifiedSize = size * 3;
                break;
        }

        this.gl.bufferData(this.gl.ARRAY_BUFFER, modifiedSize, vertexUsage);
        return buffer;
    }

    setVertexBufferData(buffer, data) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, data);
    }

    // This is sort of temporary for now. Essentially this is just for an IndexBuffer.
    createElementBuffer(data) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this.gl.STATIC_DRAW);

        return buffer;
    }

    /**
     * 
     * @param {String} source 
     * @param {Number} type 
     */
    createShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const error = new Error(`An error occurred will compiling the shader: ${this.gl.getShaderInfoLog(shader)}`);
            this.gl.deleteShader(shader);
            throw error;
        }

        return shader;
    }

    /**
     * 
     * @param {String} source 
     */
    createVertexShader(source) {
        return this.createShader(source, this.gl.VERTEX_SHADER);
    }

    /**
     * 
     * @param {String} source 
     */
    createFragmentShader(source) {
        return this.createShader(source, this.gl.FRAGMENT_SHADER);
    }

    /**
     * 
     * @param {String} vertexShaderSource 
     * @param {String} fragmentShaderSource 
     */
    createProgram(vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.createVertexShader(vertexShaderSource);
        const fragmentShader = this.createFragmentShader(fragmentShaderSource);

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        // Not sure if this is happening automatically somewhere, or if it is even needed?
        // this.gl.detachShader(program, vertexShader);
        // this.gl.detachShader(program, fragmentShader);   

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw new Error(`An error occurred while initializing the shader program:  ${this.gl.getProgramInfoLog(program)}`);
        }

        return program;
    }

    clear(color) {
        this.gl.clearColor(color.r, color.g, color.b, color.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Premultiplied Alpha.
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    }

    begin(effect) {
        this.currentProgram = effect.program;
        this.gl.useProgram(this.currentProgram);
    }

    setVertexBuffer(buffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);

        for (let element of buffer.attributeSchema.elements) {
            const index = this.gl.getAttribLocation(this.currentProgram, element.name);

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
        const location = this.gl.getUniformLocation(this.currentProgram, uniform);
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
            const index = this.gl.getAttribLocation(this.currentProgram, element.name);

            if (index < 0) {
                throw new Error(`The current program does not have a(n) '${element.name}' attribute.`);
            }

            this.gl.disableVertexAttribArray(index);
        }

        this.gl.deleteBuffer(buffer.buffer);
    }

    end() {
        this.currentProgram = null;
    }
}