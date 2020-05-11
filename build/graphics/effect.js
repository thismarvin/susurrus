import * as WebGL from "./webGL.js";
export default class Effect {
	constructor(graphics, vertexShaderSource, fragmentShaderSource) {
		this.program = WebGL.createProgram(
			graphics.gl,
			vertexShaderSource,
			fragmentShaderSource
		);
		Object.defineProperty(this, "program", {
			writable: false,
		});
	}
}
