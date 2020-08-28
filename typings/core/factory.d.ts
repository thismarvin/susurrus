import { GraphicsManager } from "../lib/graphics.js";
import Theater from "./theater.js";
import Quad from "./graphics/geometry/quad.js";
import Circle from "./graphics/geometry/circle.js";
export default class Factory {
	#private;
	constructor(theater: Theater);
	attachGraphics(graphics: GraphicsManager): void;
	createCircle(x: number, y: number, radius: number): Circle;
	createQuad(x: number, y: number, width: number, height: number): Quad;
}
//# sourceMappingURL=factory.d.ts.map
