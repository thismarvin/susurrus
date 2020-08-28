import { Effect, GraphicsManager, Texture2D } from "../../lib/graphics.js";
import GeometryData from "./geometry/geometryData.js";
import Camera from "../camera.js";
export default class Sprite {
	#private;
	constructor(texture: Texture2D);
	attachGeometry(geometry: GeometryData): this;
	attachEffect(effect: Effect): this;
	createTextureBuffer(graphics: GraphicsManager): this;
	draw(graphics: GraphicsManager, camera: Camera): void;
}
//# sourceMappingURL=sprite.d.ts.map
