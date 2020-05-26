import Shaders from "./polygonShaders.js";
import Effect from "../effect.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "../graphicsManager.js";

export default class BasicEffect extends Effect {
	constructor(graphics: Graphics) {
		super(graphics, Shaders.VERTEX, Shaders.FRAGMENT);
	}
}
