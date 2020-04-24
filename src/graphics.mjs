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

    /**
     * 
     * @param {Array} data 
     */
    createBuffer(data) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

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


    /**
     * 
     * @param {WebGLProgram} program 
     */
    apply(program) {
        this.currentProgram = program;
        this.gl.useProgram(this.currentProgram);
    }

    bindBuffer(buffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);

        for (let element of buffer.attributeSchema.elements) {
            const index = this.gl.getAttribLocation(this.currentProgram, element.name);

            if (index < 0) {
                throw new Error(`The current program does not have a(n) '${element.name}' attribute.`);
            }

            this.gl.vertexAttribPointer(index, element.size, element.type, false, element.stride, element.offset);
            this.gl.enableVertexAttribArray(index);

            if (buffer.instanceFrequency > 0) {
                this.extensions["ANGLE_instanced_arrays"].vertexAttribDivisorANGLE(index, buffer.instanceFrequency);
            }
        }
    }

    setUniform(uniform, value) {
        const location = this.gl.getUniformLocation(this.currentProgram, uniform);
        this.gl.uniformMatrix4fv(location, false, value);
    }

    drawPrimitives(type, offset, primitiveCount) {
        this.gl.drawArrays(type, offset, primitiveCount);
    }
}