import * as WebGL from "./webGL.mjs";

export default class Effect {
    //#region Class Properties
    // public:
    // =======================
    // program; // readonly
    //#endregion

    constructor(graphics, vertexShaderSource, fragmentShaderSource) {
        Object.defineProperty(this, "program", {
            "value": WebGL.createProgram(graphics.gl, vertexShaderSource, fragmentShaderSource),
            "writable": false
        });
    }
};