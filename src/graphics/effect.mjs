import * as WebGL from "./webGL.mjs";

export default class Effect {
    constructor(graphics, vertexShaderSource, fragmentShaderSource) {
        this.program = WebGL.createProgram(graphics.gl, vertexShaderSource, fragmentShaderSource);
    }
};