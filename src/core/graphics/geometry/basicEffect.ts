import * as Graphics from "../../../lib/graphics.js";
import Shaders from "./polygonShaders.js";

export default class BasicEffect extends Graphics.Effect {
	constructor(graphics: Graphics.GraphicsManager) {
		super(graphics, Shaders.VERTEX, Shaders.FRAGMENT);
	}
}
