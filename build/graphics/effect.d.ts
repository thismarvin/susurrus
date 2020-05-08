import Graphics from "./graphics.js";
export default class Effect {
    readonly program: WebGLProgram;
    constructor(graphics: Graphics, vertexShaderSource: string, fragmentShaderSource: string);
}
