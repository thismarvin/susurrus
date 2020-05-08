(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Susurrus = {}));
}(this, (function (exports) { 'use strict';

    //#region Public
    function getWebGLContext(canvas) {
        const gl = canvas.getContext("webgl");
        if (gl === null) {
            throw new Error("WebGL is not supported on this device.");
        }
        return gl;
    }
    function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = _createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = _createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        return _createProgram(gl, vertexShader, fragmentShader);
    }
    function allocateVertexBuffer(gl, size, usage) {
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
    function setVertexBufferData(gl, buffer, data) {
        _setBufferData(gl, gl.ARRAY_BUFFER, buffer, data);
    }
    function allocateIndexBuffer(gl, size) {
        return _allocateBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, size, gl.STATIC_DRAW);
    }
    function setIndexBufferData(gl, buffer, data) {
        _setBufferData(gl, gl.ELEMENT_ARRAY_BUFFER, buffer, data);
    }
    function enablePremultipliedAlpha(gl) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
    function clear(gl, r, g, b, a) {
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

    //#region Public
    /**
     * Validates whether a given value is of a given type. Throws a TypeError otherwise.
     * @param value The value that is being tested against.
     * @param {string} type The type the property is expecting.
     * @param options Optional options to apply if validation fails.
     */
    function expectType(value, type, options) {
        let valid = true;
        switch (type.toLowerCase()) {
            case "array":
                valid = Array.isArray(value);
                break;
            default:
                valid = typeof value === type;
                break;
        }
        return validateAssent(valid, options, `Expected value to be a(n) '${type}'.`);
    }
    /**
     * Validates whether a given value is of a given class instance. Throws a TypeError otherwise.
     * @param value The value the property is going to be set to.
     * @param instance The class instance the property is expecting.
     * @param options Optional options to apply if validation fails.
     */
    function expectInstance(value, instance, options) {
        let valid = value instanceof instance;
        return validateAssent(valid, options, `Expected value to be an instance of '${instance.name}'.`);
    }
    //#endregion
    //#region Private
    function validateAssent(valid, options, defaultErrorMessage) {
        const throwDefaultErrorMessage = () => {
            throw new TypeError(defaultErrorMessage);
        };
        // When there are no options, throw an error if 'valid' is false or return nothing if 'valid' is true.
        if (options === undefined) {
            if (!valid) {
                throwDefaultErrorMessage();
            }
            return;
        }
        // Alright so we have some sort of options. We need to process them.
        // Make sure options is even an object. If not, then just return nothing.
        if (typeof options !== "object") {
            return;
        }
        // Options is valid. Continue processing them.
        // If options contains a 'throwError' property and it is a boolean, instead of throwing errors or nothing at all, just return valid.
        if (options.throwError !== undefined) {
            if (typeof options.throwError === "boolean" && !options.throwError) {
                return valid;
            }
        }
        // At this point there is no reason to continue if valid is true.
        if (valid) {
            return;
        }
        // If options contains a 'errorMessage' property and it is a string, throw a TypeError with that error message.
        if (options.errorMessage !== undefined) {
            if (typeof options.errorMessage === "string" &&
                options.errorMessage.length > 0) {
                throw new TypeError(options.errorMessage);
            }
            throwDefaultErrorMessage();
        }
        // If options contains a 'addendum' property and it is a string, throw a TypeError with the original error message and the addendum.
        if (options.addendum !== undefined) {
            if (typeof options.addendum === "string" && options.addendum.length > 0) {
                throw new TypeError(`${defaultErrorMessage} ${options.addendum}`);
            }
            throwDefaultErrorMessage();
        }
    }
    //#endregion

    var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var _r, _g, _b, _a;
    const RGBStep = 1 / 255;
    class Color {
        constructor(hex, a) {
            _r.set(this, void 0);
            _g.set(this, void 0);
            _b.set(this, void 0);
            _a.set(this, void 0);
            __classPrivateFieldSet(this, _r, 0);
            __classPrivateFieldSet(this, _g, 0);
            __classPrivateFieldSet(this, _b, 0);
            __classPrivateFieldSet(this, _a, 1);
            switch (typeof hex) {
                case "number": {
                    __classPrivateFieldSet(this, _r, this.validateValue(((hex & 0xff0000) >> 16) / 255));
                    __classPrivateFieldSet(this, _g, this.validateValue(((hex & 0xff00) >> 8) / 255));
                    __classPrivateFieldSet(this, _b, this.validateValue((hex & 0xff) / 255));
                    break;
                }
                case "string": {
                    const hexAsNumber = parseInt(hex, 16);
                    __classPrivateFieldSet(this, _r, this.validateValue(((hexAsNumber & 0xff0000) >> 16) / 255));
                    __classPrivateFieldSet(this, _g, this.validateValue(((hexAsNumber & 0xff00) >> 8) / 255));
                    __classPrivateFieldSet(this, _b, this.validateValue((hexAsNumber & 0xff) / 255));
                    break;
                }
            }
            if (a !== undefined) {
                this.multiply(this.validateValue(a));
            }
        }
        get r() {
            return __classPrivateFieldGet(this, _r);
        }
        set r(value) {
            __classPrivateFieldSet(this, _r, this.validateValue(value));
        }
        get g() {
            return __classPrivateFieldGet(this, _g);
        }
        set g(value) {
            __classPrivateFieldSet(this, _g, this.validateValue(value));
        }
        get b() {
            return __classPrivateFieldGet(this, _b);
        }
        set b(value) {
            __classPrivateFieldSet(this, _b, this.validateValue(value));
        }
        get a() {
            return __classPrivateFieldGet(this, _a);
        }
        set a(value) {
            __classPrivateFieldSet(this, _a, this.validateValue(value));
        }
        fromRGB(r, g, b, a) {
            __classPrivateFieldSet(this, _r, this.validateValue(r / 255));
            __classPrivateFieldSet(this, _g, this.validateValue(g / 255));
            __classPrivateFieldSet(this, _b, this.validateValue(b / 255));
            if (a !== undefined) {
                this.multiply(this.validateValue(a));
            }
            return this;
        }
        multiply(value) {
            __classPrivateFieldSet(this, _r, this.validateValue(__classPrivateFieldGet(this, _r) * value));
            __classPrivateFieldSet(this, _g, this.validateValue(__classPrivateFieldGet(this, _g) * value));
            __classPrivateFieldSet(this, _b, this.validateValue(__classPrivateFieldGet(this, _b) * value));
            __classPrivateFieldSet(this, _a, this.validateValue(__classPrivateFieldGet(this, _a) * value));
        }
        toArray() {
            return [__classPrivateFieldGet(this, _r), __classPrivateFieldGet(this, _g), __classPrivateFieldGet(this, _b), __classPrivateFieldGet(this, _a)];
        }
        toString() {
            const rAsRGB = Math.floor(__classPrivateFieldGet(this, _r) * 255);
            const gAsRGB = Math.floor(__classPrivateFieldGet(this, _g) * 255);
            const bAsRGB = Math.floor(__classPrivateFieldGet(this, _b) * 255);
            let rString = rAsRGB.toString(16);
            if (rString.length === 1) {
                rString = `0${rString}`;
            }
            let gString = gAsRGB.toString(16);
            if (gString.length === 1) {
                gString = `0${gString}`;
            }
            let bString = bAsRGB.toString(16);
            if (bString.length === 1) {
                bString = `0${bString}`;
            }
            return `(${rAsRGB} ${gAsRGB} ${bAsRGB}) ${__classPrivateFieldGet(this, _a).toFixed(4)}, 0x${rString}${gString}${bString}`;
        }
        validateValue(value) {
            if (value < RGBStep) {
                return 0;
            }
            if (value > 1) {
                return 1;
            }
            return Math.floor(value / RGBStep) * RGBStep;
        }
    }
    _r = new WeakMap(), _g = new WeakMap(), _b = new WeakMap(), _a = new WeakMap();

    const bufferTypes = {
        VERTEX: 0,
        INDEX: 1,
    };
    Object.freeze(bufferTypes);

    var __classPrivateFieldSet$1 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    var __classPrivateFieldGet$1 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var _graphics;
    class Buffer {
        constructor(graphics, length, type) {
            _graphics.set(this, void 0);
            this.length = length;
            this.type = type;
            __classPrivateFieldSet$1(this, _graphics, graphics);
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
                throw new TypeError(`Expected an array with ${this.length} element(s). Received an array with ${data.length} element(s) instead.`);
            }
            this.data.set(data);
            switch (this.type) {
                case bufferTypes.VERTEX: {
                    setVertexBufferData(__classPrivateFieldGet$1(this, _graphics).gl, this.buffer, this.data);
                    break;
                }
                case bufferTypes.INDEX: {
                    setIndexBufferData(__classPrivateFieldGet$1(this, _graphics).gl, this.buffer, this.data);
                    break;
                }
                default: {
                    throw new TypeError(`'${this.type}' is an invalid BufferType.`);
                }
            }
        }
    }
    _graphics = new WeakMap();

    class VertexBuffer extends Buffer {
        constructor(graphics, attributeSchema, length, vertexUsage, instanceFrequency) {
            super(graphics, length, bufferTypes.VERTEX);
            this.attributeSchema = attributeSchema;
            this.vertexUsage = vertexUsage;
            this.instanceFrequency = instanceFrequency ? instanceFrequency : 0;
            this.data = new Float32Array(this.length);
            this.buffer = allocateVertexBuffer(graphics.gl, this.data.byteLength, this.vertexUsage);
            Object.defineProperty(this, "attributeSchema", {
                writable: false,
            });
            Object.defineProperty(this, "vertexUsage", {
                writable: false,
            });
            Object.defineProperty(this, "instanceFrequency", {
                writable: false,
            });
        }
    }

    var __classPrivateFieldSet$2 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    var __classPrivateFieldGet$2 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var _currentProgram;
    class Graphics {
        constructor(gl) {
            _currentProgram.set(this, void 0);
            this.gl = gl;
            this.extensions = {
                ANGLE_instanced_arrays: this.gl.getExtension("ANGLE_instanced_arrays"),
            };
            __classPrivateFieldSet$2(this, _currentProgram, null);
            enablePremultipliedAlpha(this.gl);
            Object.defineProperty(this, "gl", {
                writable: false,
            });
            Object.defineProperty(this, "extensions", {
                writable: false,
            });
        }
        clear(color) {
            expectInstance(color, Color);
            clear(this.gl, color.r, color.g, color.b, color.a);
        }
        begin(effect) {
            __classPrivateFieldSet$2(this, _currentProgram, effect.program);
            this.gl.useProgram(__classPrivateFieldGet$2(this, _currentProgram));
        }
        setVertexBuffer(buffer) {
            if (__classPrivateFieldGet$2(this, _currentProgram) === null) {
                throw new Error("'begin(effect)' must be called before setting a VertexBuffer.");
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
            for (let element of buffer.attributeSchema.elements) {
                const index = this.gl.getAttribLocation(__classPrivateFieldGet$2(this, _currentProgram), element.name);
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
            if (__classPrivateFieldGet$2(this, _currentProgram) === null) {
                throw new Error("'begin(effect)' must be called before setting a uniform.");
            }
            const location = this.gl.getUniformLocation(__classPrivateFieldGet$2(this, _currentProgram), uniform);
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
            if (__classPrivateFieldGet$2(this, _currentProgram) === null) {
                throw new Error("'begin(effect)' must be called before deleting a Buffer.");
            }
            if (expectInstance(buffer, VertexBuffer, {
                throwError: false,
            })) {
                const bufferVertexBuffer = buffer;
                for (let element of bufferVertexBuffer.attributeSchema.elements) {
                    const index = this.gl.getAttribLocation(__classPrivateFieldGet$2(this, _currentProgram), element.name);
                    if (index < 0) {
                        throw new Error(`The current program does not have a(n) '${element.name}' attribute.`);
                    }
                    this.gl.disableVertexAttribArray(index);
                }
            }
            this.gl.deleteBuffer(buffer.buffer);
        }
        end() {
            __classPrivateFieldSet$2(this, _currentProgram, null);
        }
    }
    _currentProgram = new WeakMap();

    var __classPrivateFieldSet$3 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    var __classPrivateFieldGet$3 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var _initialized;
    class Sketch {
        constructor(id) {
            _initialized.set(this, void 0);
            const element = document.getElementById(id);
            if (element === null) {
                throw new TypeError(`Could not find an element with an id of '${id}'.`);
            }
            this.parent = element;
            this.canvas = document.createElement("canvas");
            this.parent.appendChild(this.canvas);
            this.canvas.id = `${id}-canvas`;
            this.canvas.width = 400;
            this.canvas.height = 400;
            this.graphics = new Graphics(getWebGLContext(this.canvas));
            __classPrivateFieldSet$3(this, _initialized, false);
            this.loop = true;
            Object.defineProperty(this, "parent", {
                writable: false,
            });
            Object.defineProperty(this, "canvas", {
                writable: false,
            });
            Object.defineProperty(this, "graphics", {
                writable: false,
            });
        }
        run() {
            if (!__classPrivateFieldGet$3(this, _initialized)) {
                this.initialize();
                __classPrivateFieldSet$3(this, _initialized, true);
            }
            this.update();
            this.draw();
            if (this.loop) {
                window.requestAnimationFrame(this.run.bind(this));
            }
        }
        initialize() { }
        update() { }
        draw() { }
    }
    _initialized = new WeakMap();

    class AttributeElement {
        constructor(name, size, type) {
            this.name = name;
            this.size = size;
            this.type = type;
            this.stride = -1;
            this.offset = -1;
            Object.defineProperty(this, "name", {
                writable: false,
            });
            Object.defineProperty(this, "size", {
                writable: false,
            });
            Object.defineProperty(this, "type", {
                writable: false,
            });
        }
    }

    const attributeTypes = {
        BYTE: 5120,
        SHORT: 5122,
        UNSIGNED_BYTE: 5121,
        UNSIGNED_SHORT: 5123,
        FIXED: undefined,
        FLOAT: 5126,
    };
    Object.freeze(attributeTypes);

    const attributeSizes = {
        BYTE: 1,
        SHORT: 2,
        UNSIGNED_BYTE: 1,
        UNSIGNED_SHORT: 2,
        FIXED: undefined,
        FLOAT: 4,
    };
    Object.freeze(attributeSizes);

    function processAttributeElements(elements) {
        let size = 0;
        let stride = 0;
        // Calculate total size and stride of all attribute elements.
        let strideOffsets = [];
        for (let element of elements) {
            size += element.size;
            strideOffsets.push(stride);
            switch (element.type) {
                case attributeTypes.FLOAT:
                    stride += attributeSizes.FLOAT * element.size;
                    break;
                default:
                    throw new TypeError("Unsupported attribute type.");
            }
        }
        // Update each element to reflect the schema's stride.
        for (let i = 0; i < elements.length; i++) {
            elements[i].stride = stride;
            elements[i].offset = strideOffsets[i];
        }
        return {
            size: size,
            stride: stride,
        };
    }
    class AttributeSchema {
        constructor(elements) {
            this.elements = elements;
            const result = processAttributeElements(this.elements);
            this.size = result.size;
            this.stride = result.stride;
            Object.defineProperty(this, "elements", {
                writable: false,
            });
            Object.defineProperty(this, "size", {
                writable: false,
            });
            Object.defineProperty(this, "stride", {
                writable: false,
            });
        }
    }

    const shaders = {
        vertex: `
        uniform mat4 worldViewProjection;

        attribute vec3 a_position;
        attribute vec3 a_translation;
        attribute vec3 a_scale;
        attribute vec3 a_rotationOffset;
        attribute float a_rotation;
        attribute vec4 a_color;

        varying lowp vec4 v_color;

        mat4 createTranslation(vec3 translation) {
            return mat4(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                translation.x, translation.y, translation.z, 1
            );
        }

        mat4 createScale(vec3 scale) {
            return mat4(
                scale.x, 0, 0, 0,
                0, scale.y, 0, 0,
                0, 0, scale.z, 0,
                0, 0, 0, 1
            );
        }

        mat4 createRotationZ(float theta) {
            return mat4(
                cos(theta), -sin(theta), 0, 0,
                sin(theta), cos(theta), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
        }

        void main() {
            mat4 transform = createTranslation(a_rotationOffset) * createRotationZ(a_rotation) * createTranslation(-a_rotationOffset + a_translation) * createScale(a_scale);
            gl_Position = transform * vec4(a_position, 1) * worldViewProjection;
            v_color = a_color;
        }
    `,
        fragment: `
        varying lowp vec4 v_color;

        void main() {
            gl_FragColor = v_color;
        }
    `,
    };

    class Effect {
        constructor(graphics, vertexShaderSource, fragmentShaderSource) {
            this.program = createProgram(graphics.gl, vertexShaderSource, fragmentShaderSource);
            Object.defineProperty(this, "program", {
                writable: false,
            });
        }
    }

    class BasicEffect extends Effect {
        constructor(graphics) {
            super(graphics, shaders.vertex, shaders.fragment);
        }
    }

    const colors = {
        Black: new Color(0x000000),
        White: new Color(0xffffff),
        Red: new Color(0xff0000),
        Green: new Color(0x00ff00),
        Blue: new Color(0x0000ff),
        SkyBlue: new Color(0x29adff),
    };
    Object.freeze(colors);

    const drawModes = {
        POINTS: 0,
        LINES: 1,
        LINE_LOOP: 2,
        LINE_STRIP: 3,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6,
    };
    Object.freeze(drawModes);

    class IndexBuffer extends Buffer {
        constructor(graphics, length) {
            super(graphics, length, bufferTypes.INDEX);
            this.data = new Int16Array(this.length);
            this.buffer = allocateIndexBuffer(graphics.gl, this.data.byteLength);
        }
    }

    const vertexUsage = {
        STREAM: 35040,
        STATIC: 35044,
        DYNAMIC: 35048,
    };
    Object.freeze(vertexUsage);

    class Vector3 {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        multiply(value) {
            this.x *= value;
            this.y *= value;
            this.z *= value;
        }
        divide(value) {
            this.x /= value;
            this.y /= value;
            this.z /= value;
        }
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        normalize() {
            const magnitude = this.length();
            if (magnitude > 0) {
                this.divide(magnitude);
            }
        }
        toArray() {
            return [this.x, this.y, this.z];
        }
        static dot(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }
        static cross(a, b) {
            const x = a.y * b.z - b.y * a.z;
            const y = -(a.x * b.z - b.x * a.z);
            const z = a.x * b.y - b.x * a.y;
            return new Vector3(x, y, z);
        }
        static subtract(a, b) {
            const x = a.x - b.x;
            const y = a.y - b.y;
            const z = a.z - b.z;
            return new Vector3(x, y, z);
        }
    }

    var __classPrivateFieldSet$4 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    var __classPrivateFieldGet$4 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var _position, _scale, _rotationOffset, _rotation, _color, _transformChanged;
    const attributeSchema = new AttributeSchema([
        new AttributeElement("a_translation", 3, attributeTypes.FLOAT),
        new AttributeElement("a_scale", 3, attributeTypes.FLOAT),
        new AttributeElement("a_rotationOffset", 3, attributeTypes.FLOAT),
        new AttributeElement("a_rotation", 1, attributeTypes.FLOAT),
        new AttributeElement("a_color", 4, attributeTypes.FLOAT),
    ]);
    class Polygon {
        constructor(graphics, geometry) {
            _position.set(this, void 0);
            _scale.set(this, void 0);
            _rotationOffset.set(this, void 0);
            _rotation.set(this, void 0);
            _color.set(this, void 0);
            _transformChanged.set(this, void 0);
            this.geometry = geometry;
            this.attributeSchema = attributeSchema;
            __classPrivateFieldSet$4(this, _position, new Vector3(0, 0, 0));
            __classPrivateFieldSet$4(this, _scale, new Vector3(1, 1, 1));
            __classPrivateFieldSet$4(this, _rotationOffset, new Vector3(0, 0, 0));
            __classPrivateFieldSet$4(this, _rotation, 0);
            __classPrivateFieldSet$4(this, _color, new Color(0xffffff));
            this.transformBuffer = new VertexBuffer(graphics, this.attributeSchema, this.attributeSchema.size * 1, vertexUsage.DYNAMIC, 1);
            this.updateBuffer();
            __classPrivateFieldSet$4(this, _transformChanged, false);
            Object.defineProperty(this, "geometry", {
                writable: false,
            });
            Object.defineProperty(this, "attributeSchema", {
                writable: false,
            });
            Object.defineProperty(this, "transformBuffer", {
                writable: false,
            });
        }
        get position() {
            return __classPrivateFieldGet$4(this, _position);
        }
        set position(value) {
            if (value === __classPrivateFieldGet$4(this, _position)) {
                return;
            }
            __classPrivateFieldSet$4(this, _position, value);
            __classPrivateFieldSet$4(this, _transformChanged, true);
        }
        get scale() {
            return __classPrivateFieldGet$4(this, _scale);
        }
        set scale(value) {
            if (value === __classPrivateFieldGet$4(this, _scale)) {
                return;
            }
            __classPrivateFieldSet$4(this, _scale, value);
            __classPrivateFieldSet$4(this, _transformChanged, true);
        }
        get rotationOffset() {
            return __classPrivateFieldGet$4(this, _rotationOffset);
        }
        set rotationOffset(value) {
            if (value === __classPrivateFieldGet$4(this, _rotationOffset)) {
                return;
            }
            __classPrivateFieldSet$4(this, _rotationOffset, value);
            __classPrivateFieldSet$4(this, _transformChanged, true);
        }
        get rotation() {
            return __classPrivateFieldGet$4(this, _rotation);
        }
        set rotation(value) {
            if (value === __classPrivateFieldGet$4(this, _rotation)) {
                return;
            }
            __classPrivateFieldSet$4(this, _rotation, value);
            __classPrivateFieldSet$4(this, _transformChanged, true);
        }
        get color() {
            return __classPrivateFieldGet$4(this, _color);
        }
        set color(value) {
            if (value === __classPrivateFieldGet$4(this, _color)) {
                return;
            }
            __classPrivateFieldSet$4(this, _color, value);
            __classPrivateFieldSet$4(this, _transformChanged, true);
        }
        applyChanges() {
            // if (!this.#transformChanged) {
            // 	return;
            // }
            __classPrivateFieldSet$4(this, _transformChanged, false);
            this.updateBuffer();
        }
        draw(graphics, effect, camera) {
            // Ideally this would always be false, but I'll just keep this here in case the user ever forgets to applyChanges themselves.
            if (__classPrivateFieldGet$4(this, _transformChanged)) {
                this.applyChanges();
            }
            graphics.begin(effect);
            graphics.setVertexBuffers([
                this.geometry.vertexBuffer,
                this.transformBuffer,
            ]);
            graphics.setIndexBuffer(this.geometry.indexBuffer);
            graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);
            graphics.drawElements(drawModes.TRIANGLES, this.geometry.totalTriangles, 0);
            graphics.end();
        }
        updateBuffer() {
            let bufferData = [];
            bufferData = bufferData.concat(__classPrivateFieldGet$4(this, _position).toArray());
            bufferData = bufferData.concat(__classPrivateFieldGet$4(this, _scale).toArray());
            bufferData = bufferData.concat(__classPrivateFieldGet$4(this, _rotationOffset).toArray());
            bufferData = bufferData.concat(__classPrivateFieldGet$4(this, _rotation));
            bufferData = bufferData.concat(__classPrivateFieldGet$4(this, _color).toArray());
            this.transformBuffer.setData(bufferData);
        }
    }
    _position = new WeakMap(), _scale = new WeakMap(), _rotationOffset = new WeakMap(), _rotation = new WeakMap(), _color = new WeakMap(), _transformChanged = new WeakMap();

    const attributeSchema$1 = new AttributeSchema([
        new AttributeElement("a_position", 3, attributeTypes.FLOAT),
    ]);
    class PolygonData {
        constructor(graphics, vertices, indices) {
            this.vertexBuffer = new VertexBuffer(graphics, attributeSchema$1, vertices.length, vertexUsage.STATIC);
            this.indexBuffer = new IndexBuffer(graphics, indices.length);
            this.totalVertices = vertices.length / 3;
            this.totalTriangles = indices.length / 3;
            this.vertexBuffer.setData(vertices);
            this.indexBuffer.setData(indices);
        }
    }

    var __classPrivateFieldSet$5 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    var __classPrivateFieldGet$5 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var _rows, _columns, _data;
    class DynamicMatrix {
        constructor(rows, columns, data) {
            _rows.set(this, void 0);
            _columns.set(this, void 0);
            _data.set(this, void 0);
            __classPrivateFieldSet$5(this, _rows, rows);
            __classPrivateFieldSet$5(this, _columns, columns);
            __classPrivateFieldSet$5(this, _data, new Array(__classPrivateFieldGet$5(this, _rows) * __classPrivateFieldGet$5(this, _columns)).fill(0));
            if (data !== undefined) {
                this.setData(data);
            }
        }
        get rows() {
            return __classPrivateFieldGet$5(this, _rows);
        }
        get columns() {
            return __classPrivateFieldGet$5(this, _columns);
        }
        get data() {
            return __classPrivateFieldGet$5(this, _data);
        }
        get(x, y) {
            return this.data[this.columns * y + x];
        }
        setData(data) {
            expectType(data, "array");
            if (data.length !== this.rows * this.columns) {
                throw new TypeError("The data does not match the dimensions of the matrix.");
            }
            __classPrivateFieldSet$5(this, _data, data.slice(0));
        }
        set(x, y, value) {
            expectType(value, "number");
            __classPrivateFieldGet$5(this, _data)[this.columns * y + x] = value;
        }
        transpose() {
            const transposed = new Array(this.rows * this.columns).fill(0);
            const newRows = this.columns;
            const newColumns = this.rows;
            for (let y = 0; y < newRows; y++) {
                for (let x = 0; x < newColumns; x++) {
                    transposed[newColumns * y + x] = this.data[this.columns * x + y];
                }
            }
            __classPrivateFieldSet$5(this, _data, transposed);
            __classPrivateFieldSet$5(this, _rows, newRows);
            __classPrivateFieldSet$5(this, _columns, newColumns);
        }
        add(a) {
            // First check if 'a' is just a number.
            if (expectType(a, "number", {
                throwError: false,
            })) {
                const aNumber = a;
                for (let i = 0; i < this.rows * this.columns; i++) {
                    __classPrivateFieldGet$5(this, _data)[i] += aNumber;
                }
                return this;
            }
            // Otherwise, 'a' must be a matrix.
            expectInstance(a, DynamicMatrix);
            const aMatrix = a;
            // Make sure we can even add the matrices.
            if (this.rows !== aMatrix.rows || this.columns !== aMatrix.columns) {
                throw new TypeError("Both matrices are not the same size; cannot perform operation.");
            }
            for (let i = 0; i < this.rows * this.columns; i++) {
                __classPrivateFieldGet$5(this, _data)[i] += aMatrix.data[i];
            }
            return this;
        }
        subtract(a) {
            // First check if 'a' is just a number.
            if (expectType(a, "number", {
                throwError: false,
            })) {
                const aNumber = a;
                for (let i = 0; i < this.rows * this.columns; i++) {
                    __classPrivateFieldGet$5(this, _data)[i] -= aNumber;
                }
                return this;
            }
            // Otherwise, 'a' must be a matrix.
            expectInstance(a, DynamicMatrix);
            const aMatrix = a;
            // Make sure we can even subtract the matrices.
            if (this.rows !== aMatrix.rows || this.columns !== aMatrix.columns) {
                throw new TypeError("Both matrices are not the same size; cannot perform operation.");
            }
            for (let i = 0; i < this.rows * this.columns; i++) {
                __classPrivateFieldGet$5(this, _data)[i] -= aMatrix.data[i];
            }
            return this;
        }
        multiply(a) {
            // First check if 'a' is just a number.
            if (expectType(a, "number", {
                throwError: false,
            })) {
                const aNumber = a;
                for (let i = 0; i < this.rows * this.columns; i++) {
                    __classPrivateFieldGet$5(this, _data)[i] *= aNumber;
                }
                return this;
            }
            // Otherwise, 'a' must be a matrix.
            expectInstance(a, DynamicMatrix);
            const aMatrix = a;
            // Make sure we can even multiply the matrices.
            if (this.columns !== aMatrix.rows) {
                throw new TypeError(`The matrix provided must have ${this.columns} rows; cannot multiply matrices.`);
            }
            const result = new DynamicMatrix(this.rows, aMatrix.columns);
            for (let aY = 0; aY < this.rows; aY++) {
                for (let aX = 0; aX < this.columns; aX++) {
                    for (let bX = 0; bX < aMatrix.columns; bX++) {
                        result.set(bX, aY, result.get(bX, aY) + this.get(aX, aY) * aMatrix.get(bX, aX));
                    }
                }
            }
            __classPrivateFieldSet$5(this, _data, result.data);
            return this;
        }
        divide(a) {
            expectType(a, "number");
            const inverse = 1 / a;
            for (let i = 0; i < this.rows * this.columns; i++) {
                __classPrivateFieldGet$5(this, _data)[i] *= inverse;
            }
            return this;
        }
        toString() {
            let string = "";
            for (let i = 0; i < __classPrivateFieldGet$5(this, _data).length; i += this.columns) {
                string += `( ${__classPrivateFieldGet$5(this, _data)[i]}`;
                for (let j = 1; j < this.columns; j++) {
                    string += ` ${__classPrivateFieldGet$5(this, _data)[i + j]}`;
                }
                string += " )";
                if (i !== __classPrivateFieldGet$5(this, _data).length - this.columns) {
                    string += " ";
                }
            }
            return string;
        }
    }
    _rows = new WeakMap(), _columns = new WeakMap(), _data = new WeakMap();

    class Matrix extends DynamicMatrix {
        constructor(data) {
            super(4, 4, data);
        }
        static identity() {
            return new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        }
        static createRotationZ(angle) {
            const matrix = Matrix.identity();
            matrix.set(0, 0, Math.cos(angle));
            matrix.set(1, 0, Math.sin(angle));
            matrix.set(0, 1, -Math.sin(angle));
            matrix.set(1, 1, Math.cos(angle));
            return matrix;
        }
        static createTranslation(x, y, z) {
            const matrix = Matrix.identity();
            if (x)
                matrix.set(0, 3, x);
            if (y)
                matrix.set(1, 3, y);
            if (z)
                matrix.set(2, 3, z);
            return matrix;
        }
        static createOrthographic(width, height, near, far) {
            const matrix = Matrix.identity();
            // matrix.set(0, 0, 2 / width);
            // matrix.set(1, 1, 2 / height);
            // matrix.set(2, 2, -2 / (far - near));
            // matrix.set(0, 3, -1);
            // matrix.set(1, 3, -1);
            // matrix.set(2, 3, -(far + near) / (far - near));
            matrix.set(0, 0, 2 / width);
            matrix.set(1, 1, 2 / height);
            matrix.set(2, 2, 1 / (near - far));
            matrix.set(2, 3, near / (near - far));
            return matrix;
        }
        static createLookAt(cameraPosition, cameraTarget, cameraUp) {
            const a = Vector3.subtract(cameraPosition, cameraTarget);
            a.normalize();
            const b = Vector3.cross(cameraUp, a);
            b.normalize();
            const c = Vector3.cross(a, b);
            const matrix = Matrix.identity();
            matrix.set(0, 0, b.x);
            matrix.set(1, 0, c.x);
            matrix.set(2, 0, a.x);
            matrix.set(0, 1, b.y);
            matrix.set(1, 1, c.y);
            matrix.set(2, 1, a.y);
            matrix.set(0, 2, b.z);
            matrix.set(1, 2, c.z);
            matrix.set(2, 2, a.z);
            matrix.set(0, 3, -Vector3.dot(b, cameraPosition));
            matrix.set(1, 3, -Vector3.dot(c, cameraPosition));
            matrix.set(2, 3, -Vector3.dot(a, cameraPosition));
            return matrix;
        }
    }

    class Camera {
        constructor() {
            this.world = Matrix.createTranslation(0, 0, 0);
            this.view = Matrix.createLookAt(new Vector3(0, 0, 1), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
            this.projection = Matrix.createOrthographic(4, 4, 0, 16);
            this.worldViewProjection = this.view.multiply(this.world).multiply(this.projection);
        }
    }

    exports.AttributeElement = AttributeElement;
    exports.AttributeSchema = AttributeSchema;
    exports.AttributeType = attributeTypes;
    exports.BasicEffect = BasicEffect;
    exports.Camera = Camera;
    exports.Color = Color;
    exports.Colors = colors;
    exports.DrawMode = drawModes;
    exports.DynamicMatrix = DynamicMatrix;
    exports.Effect = Effect;
    exports.IndexBuffer = IndexBuffer;
    exports.Matrix = Matrix;
    exports.Polygon = Polygon;
    exports.PolygonData = PolygonData;
    exports.Sketch = Sketch;
    exports.Vector2 = Vector3;
    exports.Vector3 = Vector3;
    exports.Vector4 = Vector3;
    exports.VertexBuffer = VertexBuffer;
    exports.VertexUsage = vertexUsage;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
