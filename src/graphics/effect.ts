import * as WebGL from "./webGL.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "./graphics.js";

export default class Effect {
	public readonly program: WebGLProgram;

	constructor(
		graphics: Graphics,
		vertexShaderSource: string,
		fragmentShaderSource: string
	) {
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
