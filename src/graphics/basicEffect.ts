import shaders from "./shaders.js";
import Effect from "./effect.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "./graphics.js";

export default class BasicEffect extends Effect {
	constructor(graphics: Graphics) {
		super(graphics, shaders.vertex, shaders.fragment);
	}
}
