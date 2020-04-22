export default class Effect {
    constructor(graphics, vertexShaderSource, fragmentShaderSource) {
        this.program = graphics.createProgram(vertexShaderSource, fragmentShaderSource);
    }
};