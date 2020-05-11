import shaders from "./shaders.js";
import Effect from "./effect.js";
export default class BasicEffect extends Effect {
	constructor(graphics) {
		super(graphics, shaders.vertex, shaders.fragment);
	}
}
