//#region Public
export function getWebGLContext(canvas) {
    const gl = canvas.getContext("webgl");
    if (gl === null) {
        throw new Error("WebGL is not supported on this device.");
    }
    return gl;
}
export function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = _createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = _createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    return _createProgram(gl, vertexShader, fragmentShader);
}
export function allocateVertexBuffer(gl, size, usage) {
    /**
     * I am not sure if I am going to keep this.
     * For some reason I cannot use DYNAMIC DRAW unless the allocated
     * size is three times the initial size???
     * STATIC_DRAW works perfectly fine with the initial size.
     * I am not even sure if DYNAMIC_DRAW is even better than STATIC_DRAW in the
     * first place.
     */
    let adjustedSize = size;
    switch (usage) {
        case gl.DYNAMIC_DRAW:
            adjustedSize = size * 4;
            break;
    }
    return _allocateBuffer(gl, gl.ARRAY_BUFFER, adjustedSize, usage);
}
export function setVertexBufferData(gl, buffer, data) {
    _setBufferData(gl, gl.ARRAY_BUFFER, buffer, data);
}
export function allocateIndexBuffer(gl, size) {
    return _allocateBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, size, gl.STATIC_DRAW);
}
export function setIndexBufferData(gl, buffer, data) {
    _setBufferData(gl, gl.ELEMENT_ARRAY_BUFFER, buffer, data);
}
export function enablePremultipliedAlpha(gl) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}
export function clear(gl, r, g, b, a) {
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
//#endregion
//#region Private
function _allocateBuffer(gl, target, size, usage) {
    const buffer = gl.createBuffer();
    if (buffer === null) {
        throw new Error("Something went wrong; could not create WebGLBuffer.");
    }
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, size, usage);
    return buffer;
}
function _setBufferData(gl, target, buffer, data) {
    gl.bindBuffer(target, buffer);
    gl.bufferSubData(target, 0, data);
}
function _createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (shader === null) {
        throw new TypeError(`'${type}' is not a valid WebGL shader type.`);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = new Error(`An error occurred will compiling the shader: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        throw error;
    }
    return shader;
}
function _createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    if (program === null) {
        throw new Error("Something went wrong; could not create WebGLProgram.");
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`An error occurred while initializing the shader program: ${gl.getProgramInfoLog(program)}`);
    }
    return program;
}
//#endregion
