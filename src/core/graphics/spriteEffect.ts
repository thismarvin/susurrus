// eslint-disable-next-line no-unused-vars
import { Effect, GraphicsManager } from "../../lib/graphics.js";
import Shader from "./spriteShader.js";

export default class SpriteEffect extends Effect {
	constructor(graphics: GraphicsManager) {
		super(graphics, Shader.VERTEX, Shader.FRAGMENT);
	}
}
