import shaders from "./shaders.mjs";
import Effect from "./effect.mjs";

export default class BasicEffect extends Effect {
    constructor(graphics) {
        super(graphics, shaders.vertex, shaders.fragment);
    }
}