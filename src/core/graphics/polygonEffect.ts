import * as Graphics from "../../lib/graphics.js";
import Shader from "./polygonShader.js";

export default class PolygonEffect extends Graphics.Effect {
	constructor(graphics: Graphics.GraphicsManager) {
		super(graphics, Shader.VERTEX, Shader.FRAGMENT);
	}
}
