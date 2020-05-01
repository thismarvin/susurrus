import * as WebGL from "./webGL.mjs";

export default class Effect {
    // public:
    program; // readonly

    constructor(graphics, vertexShaderSource, fragmentShaderSource) {
        Object.defineProperty(this, "program", {
            "value": WebGL.createProgram(graphics.gl, vertexShaderSource, fragmentShaderSource),
            "writable": false
        });
    }
};