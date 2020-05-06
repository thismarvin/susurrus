(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Susurrus = {}));
}(this, (function (exports) { 'use strict';

    //#region Public
    /**
     * 
     * @param {String} id 
     * @returns {WebGLRenderingContext}
     */
    function getWebGLContext(id) {
        const canvas = document.getElementById(id);
        const gl = canvas.getContext("webgl");

        if (gl === null) {
            throw new Error("WebGL is not supported on this device.");
        }

        return gl;
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {String} vertexShaderSource 
     * @param {String} fragmentShaderSource 
     * @returns {WebGLProgram}
     */
    function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = _createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = _createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        return _createProgram(gl, vertexShader, fragmentShader);
    }

    //#region Buffers
    /**
     * 
     * @param {WebGLRenderingContext} gl
     * @param {Number} size 
     * @param {Number} usage 
     */
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
            case (gl.DYNAMIC_DRAW):
                adjustedSize = size * 4;
                break;
        }

        return _allocateBuffer(gl, gl.ARRAY_BUFFER, adjustedSize, usage);
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl
     * @param {WebGLBuffer} buffer 
     * @param {BufferSource} data 
     */
    function setVertexBufferData(gl, buffer, data) {
        _setBufferData(gl, gl.ARRAY_BUFFER, buffer, data);
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl
     * @param {Number} size 
     */
    function allocateIndexBuffer(gl, size) {
        return _allocateBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, size, gl.STATIC_DRAW);
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl
     * @param {WebGLBuffer} buffer 
     * @param {BufferSource} data 
     */
    function setIndexBufferData(gl, buffer, data) {
        _setBufferData(gl, gl.ELEMENT_ARRAY_BUFFER, buffer, data);
    }
    //#endregion
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
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(`An error occurred while initializing the shader program: ${gl.getProgramInfoLog(program)}`);
        }

        return program;
    }
    //#endregion

    class Graphics {
        //#region Class Properties
        // public:
        // =======================
        // gl; // readonly
        // extensions; // readonly

        // private:
        // =======================
        // _currentProgram;
        //#endregion

        /**
         * 
         * @param {WebGLRenderingContext} gl 
         */
        constructor(gl) {
            Object.defineProperty(this, "gl", {
                "value": gl,
                "writable": false
            });

            Object.defineProperty(this, "extensions", {
                "value": {
                    "ANGLE_instanced_arrays": this.gl.getExtension("ANGLE_instanced_arrays")
                },
                "writable": false
            });

            this._currentProgram = null;

            enablePremultipliedAlpha(this.gl);
        }

        clear(color) {
            clear(this.gl, color.r, color.g, color.b, color.a);
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

    class Sketch {
        constructor(id) {
            this.parent = document.getElementById(id);
            this.canvas = document.createElement("canvas");
            this.parent.appendChild(this.canvas);
            this.canvas.id = `${id}-canvas`;
            this.canvas.width = 400;
            this.canvas.height = 400;

            this.graphics = new Graphics(getWebGLContext(`${id}-canvas`));

            this.initialized = false;
            this.running = true;
        }

        run() {
            if (!this.initialized) {
                this.initialize();
                this.initialized = true;
            }

            this.update();
            this.draw();

            if (this.running) {
                window.requestAnimationFrame(this.run.bind(this));
            }
        }

        initialize() {

        }

        update() {

        }

        draw() {

        }
    }

    class AttributeElement {
        //#region Class Properties
        // public:
        // =======================
        // name; // readonly
        // size; // readonly
        // type; // readonly
        // stride;
        // offset;
        //#endregion

        constructor(name, size, type) {
            Object.defineProperty(this, "name", {
                "value": name,
                "writable": false
            });

            Object.defineProperty(this, "size", {
                "value": size,
                "writable": false
            });

            Object.defineProperty(this, "type", {
                "value": type,
                "writable": false
            });

            this.stride = 0;
            this.offset = 0;
        }
    }

    const attributeTypes = {
        "BYTE": 5120,
        "SHORT": 5122,
        "UNSIGNED_BYTE": 5121,
        "UNSIGNED_SHORT": 5123,
        "FIXED": undefined,
        "FLOAT": 5126,
    };

    Object.freeze(attributeTypes);

    const attributeSizes = {
        "BYTE": 1, // ???
        "SHORT": 2, // ???
        "UNSIGNED_BYTE": 1, // ???
        "UNSIGNED_SHORT": 2, // ???
        "FIXED": undefined, // ???
        "FLOAT": 4,
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
                case (attributeTypes.FLOAT):
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
            "size": size,
            "stride": stride
        };
    }

    class AttributeSchema {
        //#region Class Properties
        // public:
        // =======================
        // elements; // readonly
        // size; // readonly
        // stride; // readonly
        //#endregion

        constructor(elements) {
            Object.defineProperty(this, "elements", {
                "value": elements,
                "writable": false
            });

            const result = processAttributeElements(this.elements);

            Object.defineProperty(this, "size", {
                "value": result.size,
                "writable": false
            });

            Object.defineProperty(this, "stride", {
                "value": result.stride,
                "writable": false
            });
        }
    }

    const shaders = {
        "vertex": `
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
        "fragment": `
        varying lowp vec4 v_color;

        void main() {
            gl_FragColor = v_color;
        }
    `
    };

    class Effect {
        //#region Class Properties
        // public:
        // =======================
        // program; // readonly
        //#endregion

        constructor(graphics, vertexShaderSource, fragmentShaderSource) {
            Object.defineProperty(this, "program", {
                "value": createProgram(graphics.gl, vertexShaderSource, fragmentShaderSource),
                "writable": false
            });
        }
    }

    class BasicEffect extends Effect {
        constructor(graphics) {
            super(graphics, shaders.vertex, shaders.fragment);
        }
    }

    //#region Public
    /**
     * Validates whether a given value is of a given type. Throws a TypeError otherwise.
     * @param value The value that is being tested against.
     * @param {String} type The type the property is expecting.
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
    /**
     * 
     * @param {Boolean} valid 
     * @param options 
     * @param {String} defaultErrorMessage
     */
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
            if (typeof options.errorMessage === "string" && options.errorMessage.length > 0) {
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

    class Color {
        //#region Class Properties
        // public:
        // =======================
        // r;
        // g;
        // b;
        // a;

        // private:
        // =======================
        // _r;
        // _g;
        // _b;
        // _a;
        //#endregion

        constructor(r, g, b, a) {
            this._r = r;
            this._g = g;
            this._b = b;
            this._a = a;

            Object.defineProperty(this, "r", {
                get() {
                    return this._r * this._a;
                },
                set(value) {
                    this._r = value;
                }
            });
            Object.defineProperty(this, "g", {
                get() {
                    return this._g * this._a;
                },
                set(value) {
                    this._g = value;
                }
            });
            Object.defineProperty(this, "b", {
                get() {
                    return this._b * this._a;
                },
                set(value) {
                    this._b = value;
                }
            });
            Object.defineProperty(this, "a", {
                get() {
                    return this._a;
                },
                set(value) {
                    this._a = value;
                }
            });

            return new Proxy(this, proxySetTrap);
        }

        toArray() {
            return [this.r, this.g, this.b, this.a];
        }

        toString() {
            return `( ${parseInt(this.r * 255)} ${parseInt(this.g * 255)} ${parseInt(this.b * 255)} ${parseInt(this.a * 255)} )`;
        }
    }

    class ColorFromHex {
        constructor(hex, a) {
            const r = ((hex & 0xFF0000) >> 16) / 255;
            const g = ((hex & 0xFF00) >> 8) / 255;
            const b = (hex & 0xFF) / 255;
            return new Color(r, g, b, a);
        }
    }

    const lowpLowerBounds = 0.00390625;

    /**
     * Maps a given value to be within the range [0, 1]. Note that if the value is greater than one
     * then the functions assumes we are working with integer RGB values that are in the range [0, 255].
     * @param {number} value The number to be mapped.
     */
    function mapColorValue(value) {
        // Don't store a number with more precision than lowp even has.
        if (value <= lowpLowerBounds) {
            return 0;
        }

        // If the value is less than one, we can assume the color has already been mapped.
        if (value <= 1) {
            return value;
        }

        // The value has not been mapped, so let us map the color and check both bounds.
        let result = parseInt(value) / 255;
        result = Math.max(0, result);
        result = Math.min(1, result);

        return result;
    }
    /**
     * This trap is specifically for Color's constructor. Essentially this trap handles overloading,
     * but in a hacky JavaScript kinda way.
     */
    const proxyConstructTrap = {
        construct(_, args) {
            // Make sure all arguments are numbers.
            for (let argument of args) {
                expectType(argument, "number");
            }

            // Map all arguments to valid values.
            const processedArguments = args.map(i => mapColorValue(i));

            switch (args.length) {
                case 0:
                    return new Color(0, 0, 0, 1);
                case 1:
                    return new ColorFromHex(args[0], 1);
                case 2:
                    return new ColorFromHex(args[0], processedArguments[1]);
                case 3:
                    return new Color(...processedArguments, 1);
                case 4:
                    return new Color(...processedArguments);
                default:
                    throw new TypeError(`'Color' does not have a constructor with ${args.length} arguments.`);
            }
        }
    };

    /** 
     * I'll admit, this is sort of unnecessary.
     * However, without this, users can create properties that should not exist. 😯
     * It might be a hassle to maintain, but I think it is worth it.
     */
    const colorProperties = new Set(["r", "g", "b", "a", "_r", "_g", "_b", "_a"]);
    /**
     * This trap is essentially used for validation. Color is a pretty simple class, so all
     * I really have to do is make sure the value is a number and map it between [0, 1]. Note that this trap is ignored
     * when initially setting all properties in the constructor. Also, who knew you could change what an Object's constructor
     * returns? 😵
     */
    const proxySetTrap = {
        set(target, property, value) {
            // Again, this isn't really necessary. Although I do not want new properties being added! 😡
            if (!colorProperties.has(property)) {
                throw new TypeError(`Color does not have a(n) '${property}' property; cannot set value.`);
            }

            // Make sure the value is a number.
            expectType(value, "number");

            const mappedValue = mapColorValue(value);

            return Reflect.set(target, property, mappedValue);
        }
    };

    /**
     * The default export needs to be a Proxy in order for a "construct" trap to work.
     * The fact that this is a const and it's being exported feels kinda hacky,
     * but hey, Proxies are hacky in the first place! 😎
     * In the future, if you are ever going to refactor this, just know that if this is a
     * class then everything breaks.
     */
    const colorProxy = new Proxy(Color, proxyConstructTrap);

    const colors = {
        "Black": new colorProxy(0x000000),
        "White": new colorProxy(0xFFFFFF),
        "Red": new colorProxy(0xFF0000),
        "Green": new colorProxy(0x00FF00),
        "Blue": new colorProxy(0x0000FF),

        "SkyBlue": new colorProxy(0x29ADFF),
    };

    Object.freeze(colors);

    const drawModes = {
        "POINTS": 0,
        "LINES": 1,
        "LINE_LOOP": 2,
        "LINE_STRIP": 3,
        "TRIANGLES": 4,
        "TRIANGLE_STRIP": 5,
        "TRIANGLE_FAN": 6,
    };

    Object.freeze(drawModes);

    const bufferTypes = {
        "VERTEX": 0,
        "INDEX": 1
    };

    Object.freeze(bufferTypes);

    class Buffer {
        //#region Class Properties
        // public:
        // =======================
        // length; // readonly
        // type; // readonly
        // data;
        // buffer;

        // // private:
        // =======================
        // _graphics; // readonly
        //#endregion

        constructor(graphics, length, type) {
            Object.defineProperty(this, "_graphics", {
                "value": graphics
            });

            Object.defineProperty(this, "length", {
                "value": length,
                "writable": false
            });

            Object.defineProperty(this, "type", {
                "value": type,
                "writable": false
            });

            this.data = null;
            this.buffer = null;
        }

        setData(data) {
            if (data.length != this.length) {
                throw new TypeError(`Expected an array with ${this.length} element(s). Received an array with ${data.length} element(s) instead.`);
            }

            this.data.set(data);

            switch (this.type) {
                case bufferTypes.VERTEX:
                    setVertexBufferData(this._graphics.gl, this.buffer, this.data);
                    break;
                case bufferTypes.INDEX:
                    setIndexBufferData(this._graphics.gl, this.buffer, this.data);
                    break;
                default:
                    throw new TypeError(`'${this.type}' is an invalid BufferType.`);
            }
        }
    }

    class IndexBuffer extends Buffer {
        constructor(graphics, length) {
            super(graphics, length, bufferTypes.INDEX);

            this.data = new Int16Array(this.length);
            this.buffer = allocateIndexBuffer(graphics.gl, this.data.byteLength);
        }
    }

    const vertexUsage = {
        "STREAM": 35040,
        "STATIC": 35044,
        "DYNAMIC": 35048
    };

    Object.freeze(vertexUsage);

    class VertexBuffer extends Buffer {
        //#region Class Properties
        // public:
        // =======================
        // attributeSchema; // readonly
        // vertexUsage; // readonly
        // instanceFrequency; // readonly
        //#endregion

        constructor(graphics, attributeSchema, length, vertexUsage$1, instanceFrequency) {
            super(graphics, length, bufferTypes.VERTEX);

            Object.defineProperty(this, "attributeSchema", {
                "value": attributeSchema,
                "writable": false
            });

            Object.defineProperty(this, "vertexUsage", {
                "value": vertexUsage$1 !== undefined ? vertexUsage$1 : vertexUsage.STATIC,
                "writable": false
            });

            Object.defineProperty(this, "instanceFrequency", {
                "value": instanceFrequency !== undefined ? instanceFrequency : 0,
                "writable": false
            });

            this.data = new Float32Array(this.length);
            this.buffer = allocateVertexBuffer(graphics.gl, this.data.byteLength, this.vertexUsage);
        }
    }

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

    const polygonProperties = new Set([
        "position", "scale", "rotationOffset", "rotation", "color",
        "_position", "_scale", "_rotationOffset", "_rotation", "_color",
        "_transformChanged"
    ]);

    const proxySetTrap$1 = {
        set(target, property, value) {
            // Again, this isn't really necessary. Although I do not want new properties being added! 😡
            if (!polygonProperties.has(property)) {
                throw new TypeError(`Polygon does not have a(n) '${property}' property; cannot set value.`);
            }

            const addendum = `Cannot set '${property}' property.`;

            // Validate values before setting them.
            switch (property) {
                case "position":
                case "_position":
                case "scale":
                case "_scale":
                case "rotationOffset":
                case "_rotationOffset":
                    expectInstance(value, Vector3, {
                        "addendum": addendum
                    });
                    break;
                case "color":
                case "_color":
                    expectInstance(value, colorProxy, {
                        "addendum": addendum
                    });
                    break;
                case "rotation":
                case "_rotation":
                    expectType(value, "number", {
                        "addendum": addendum
                    });
                    break;
                case "_transformChanged":
                    expectType(value, "boolean", {
                        "addendum": addendum
                    });
                    break;
            }

            // Passed validation; set the value now.
            return Reflect.set(target, property, value);
        }
    };

    class Polygon {
        //#region Class Properties
        // public:
        // =======================
        // geometry; // readonly
        // attributeSchema; // readonly
        // transformBuffer; // readonly
        // position;
        // scale;
        // rotationOffset;
        // rotation;
        // color;

        // private:
        // =======================
        // _position;
        // _scale;
        // _rotationOffset;
        // _rotation;
        // _color;

        // _transformChanged;
        //#endregion

        constructor(graphics, geometry) {
            Object.defineProperty(this, "geometry", {
                "value": geometry,
                "writable": false
            });

            Object.defineProperty(this, "attributeSchema", {
                "value": new AttributeSchema([
                    new AttributeElement("a_translation", 3, attributeTypes.FLOAT),
                    new AttributeElement("a_scale", 3, attributeTypes.FLOAT),
                    new AttributeElement("a_rotationOffset", 3, attributeTypes.FLOAT),
                    new AttributeElement("a_rotation", 1, attributeTypes.FLOAT),
                    new AttributeElement("a_color", 4, attributeTypes.FLOAT)
                ]),
                "writable": false
            });

            Object.defineProperty(this, "position", {
                get() {
                    return this._position;
                },
                set(value) {
                    if (this._position === value) {
                        return;
                    }

                    this._position = value;
                    this._transformChanged = true;
                }
            });

            Object.defineProperty(this, "scale", {
                get() {
                    return this._scale;
                },
                set(value) {
                    if (this._scale === value) {
                        return;
                    }

                    this._scale = value;
                    this._transformChanged = true;
                }
            });

            Object.defineProperty(this, "rotationOffset", {
                get() {
                    return this._rotationOffset;
                },
                set(value) {
                    if (this._rotationOffset === value) {
                        return;
                    }

                    this._rotationOffset = value;
                    this._transformChanged = true;
                }
            });

            Object.defineProperty(this, "rotation", {
                get() {
                    return this._rotation;
                },
                set(value) {
                    if (this._rotation === value) {
                        return;
                    }

                    this._rotation = value;
                    this._transformChanged = true;
                }
            });

            Object.defineProperty(this, "color", {
                get() {
                    return this._color;
                },
                set(value) {
                    if (this._color === value) {
                        return;
                    }

                    this._color = value;
                    this._transformChanged = true;
                }
            });

            this._position = new Vector3(0, 0, 0);
            this._scale = new Vector3(1, 1, 1);
            this._rotationOffset = new Vector3(0, 0, 0);
            this._rotation = 0;
            this._color = new colorProxy(0xFFFFFF);

            Object.defineProperty(this, "transformBuffer", {
                "value": new VertexBuffer(graphics, this.attributeSchema, this.attributeSchema.size * 1, vertexUsage.DYNAMIC, 1),
                "writable": false
            });

            this._updateBuffer();
            this._transformChanged = false;

            return new Proxy(this, proxySetTrap$1);
        }

        applyChanges() {
            if (!this._transformChanged) {
                return;
            }

            this._transformChanged = false;
            this._updateBuffer();
        }

        draw(graphics, effect, camera) {
            // Ideally this would always be false, but I'll just keep this here in case the user ever forgets to applyChanges themselves.
            if (this._transformChanged) {
                this.applyChanges();
            }

            graphics.begin(effect);

            graphics.setVertexBuffers([this.geometry.vertexBuffer, this.transformBuffer]);
            graphics.setIndexBuffer(this.geometry.indexBuffer);

            graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);

            graphics.drawElements(drawModes.TRIANGLES, this.geometry.totalTriangles, 0);

            graphics.end();
        }

        _updateBuffer() {
            const bufferData = [].concat(
                this._position.toArray(),
                this._scale.toArray(),
                this._rotationOffset.toArray(),
                this._rotation,
                this._color.toArray()
            );

            this.transformBuffer.setData(bufferData);
        }
    }

    const attributeSchema = new AttributeSchema([
        new AttributeElement("a_position", 3, attributeTypes.FLOAT)
    ]);

    class PolygonData {
        //#region Class Properties
        // public:
        // =======================
        // vertexBuffer; // readonly
        // indexBuffer; // readonly
        // totalVertices; // readonly
        // totalTriangles; // readonly
        //#endregion

        constructor(graphics, vertices, indices) {
            Object.defineProperty(this, "vertexBuffer", {
                "value": new VertexBuffer(graphics, attributeSchema, vertices.length, vertexUsage.STATIC),
                "writable": false
            });


            Object.defineProperty(this, "indexBuffer", {
                "value": new IndexBuffer(graphics, indices.length),
                "writable": false
            });


            Object.defineProperty(this, "totalVertices", {
                "value": vertices.length / 3,
                "writable": false
            });


            Object.defineProperty(this, "totalTriangles", {
                "value": indices.length / 3,
                "writable": false
            });

            this.vertexBuffer.setData(vertices);
            this.indexBuffer.setData(indices);
        }
    }

    class DynamicMatrix {
        //#region Class Properties
        // public:
        // =======================
        // rows;
        // columns;
        // data;

        // private:
        // =======================
        // _rows;
        // _columns;
        // _data;
        //#endregion

        constructor(rows, columns, data) {
            this._rows = rows;
            this._columns = columns;
            this._data = new Array(this._rows * this._columns).fill(0);

            Object.defineProperty(this, "rows", {
                get() {
                    return this._rows;
                }
            });

            Object.defineProperty(this, "columns", {
                get() {
                    return this._columns;
                }
            });

            Object.defineProperty(this, "data", {
                get() {
                    return this._data;
                }
            });

            if (data !== undefined) {
                this.setData(data);
            }
        }

        get(x, y) {
            return this.data[this.columns * y + x];
        }

        /**
         * 
         * @param {Array} data 
         */
        setData(data) {
            expectType(data, "array");

            if (data.length !== this.rows * this.columns) {
                throw new TypeError("The data does not match the dimensions of the matrix.");
            }

            this._data = data.slice(0);
        }

        set(x, y, value) {
            expectType(value, "number");

            this._data[this.columns * y + x] = value;
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

            this._data = transposed;
            this._rows = newRows;
            this._columns = newColumns;
        }

        add(a) {
            // First check if 'a' is just a number.
            if (expectType(a, "number", {
                    "throwError": false
                })) {
                for (let i = 0; i < this.rows * this.columns; i++) {
                    this._data[i] += a;
                }
                return;
            }

            // Otherwise, 'a' must be a matrix.
            expectInstance(a, DynamicMatrix);

            // Make sure we can even add the matrices.
            if (this.rows !== a.rows || this.columns !== a.columns) {
                throw new TypeError("Both matrices are not the same size; cannot perform operation.")
            }

            for (let i = 0; i < this.rows * this.columns; i++) {
                this._data[i] += a.data[i];
            }
        }

        subtract(a) {
            // First check if 'a' is just a number.
            if (expectType(a, "number", {
                    "throwError": false
                })) {
                for (let i = 0; i < this.rows * this.columns; i++) {
                    this._data[i] -= a;
                }
                return;
            }

            // Otherwise, 'a' must be a matrix.
            expectInstance(a, DynamicMatrix);

            // Make sure we can even subtract the matrices.
            if (this.rows !== a.rows || this.columns !== a.columns) {
                throw new TypeError("Both matrices are not the same size; cannot perform operation.")
            }

            for (let i = 0; i < this.rows * this.columns; i++) {
                this._data[i] -= a.data[i];
            }
        }

        multiply(a) {
            // First check if 'a' is just a number.
            if (expectType(a, "number", {
                    "throwError": false
                })) {
                for (let i = 0; i < this.rows * this.columns; i++) {
                    this._data[i] *= a;
                }
                return;
            }

            // Otherwise, 'a' must be a matrix.
            expectInstance(a, DynamicMatrix);

            // Make sure we can even multiply the matrices.
            if (this.columns !== a.rows) {
                throw new TypeError(`The matrix provided must have ${this.columns} rows; cannot multiply matrices.`);
            }

            const result = new DynamicMatrix(this.rows, a.columns);

            for (let aY = 0; aY < this.rows; aY++) {
                for (let aX = 0; aX < this.columns; aX++) {
                    for (let bX = 0; bX < a.columns; bX++) {
                        result.set(bX, aY, result.get(bX, aY) + (this.get(aX, aY) * a.get(bX, aX)));
                    }
                }
            }

            this._data = result.data;
        }

        divide(a) {
            expectType(a, "number");

            const inverse = 1 / a;
            for (let i = 0; i < this.rows * this.columns; i++) {
                this._data[i] *= inverse;
            }
        }

        toString() {
            let string = "";

            for (let i = 0; i < this._data.length; i += this.columns) {
                string += `( ${this._data[i]}`;
                for (let j = 1; j < this.columns; j++) {
                    string += ` ${this._data[i + j]}`;
                }

                string += " )";

                if (i !== this._data.length - this.columns) {
                    string += " ";
                }
            }

            return string;
        }
    }

    class Matrix {
        constructor(data) {
            this.rows = 4;
            this.columns = 4;

            this.data = new Array(this.rows * this.columns).fill(0);

            if (data) {
                this.setData(data);
            }
        }

        get(x, y) {
            return this.data[this.columns * y + x];
        }

        /**
         * 
         * @param {Array} data 
         */
        setData(data) {
            if (data.length !== this.rows * this.columns) {
                throw new Error("The data does not match the dimensions of the matrix.");
            }

            this.data = data;
        }

        set(x, y, value) {
            this.data[this.columns * y + x] = value;
        }

        toString() {
            let string = "";

            for (let i = 0; i < this.data.length; i += this.columns) {
                string += `( ${this.data[i]}`;
                for (let j = 1; j < this.columns; j++) {
                    string += ` ${this.data[i + j]}`;
                }

                string += " )";

                if (i !== this.data.length - this.columns) {
                    string += " ";
                }
            }

            return string;
        }




        static multiply(a, b) {
            const matrix = new Matrix();

            for (let aY = 0; aY < a.rows; aY++) {
                for (let aX = 0; aX < a.columns; aX++) {
                    for (let bX = 0; bX < b.columns; bX++) {
                        matrix.set(bX, aY, matrix.get(bX, aY) + (a.get(aX, aY) * b.get(bX, aX)));
                    }
                }
            }

            return matrix;
        }

        static identity() {
            return new Matrix([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }



        static createRotationZ(angle) {
            // if (!angle) {
            //     throw new Error();
            // }

            const matrix = Matrix.identity();

            matrix.set(0, 0, Math.cos(angle));
            matrix.set(1, 0, Math.sin(angle));
            matrix.set(0, 1, -Math.sin(angle));
            matrix.set(1, 1, Math.cos(angle));

            return matrix;
        }

        static createTranslation(x, y, z) {
            const matrix = Matrix.identity();

            if (x) matrix.set(0, 3, x);
            if (y) matrix.set(1, 3, y);
            if (z) matrix.set(2, 3, z);

            return matrix;
        }

        static createOrthographic(width, height, near, far) {
            // if (!width || !height || !near || !far) {
            //     throw new Error();
            // }

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

            this.worldViewProjection = Matrix.multiply(Matrix.multiply(this.view, this.world), this.projection);    }
    }

    exports.AttributeElement = AttributeElement;
    exports.AttributeSchema = AttributeSchema;
    exports.AttributeType = attributeTypes;
    exports.BasicEffect = BasicEffect;
    exports.Camera = Camera;
    exports.Color = colorProxy;
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
