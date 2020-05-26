// eslint-disable-next-line no-unused-vars
import Polygon from "./polygon.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "../graphicsManager.js";
import GeometryData from "./geometryData.js";
import * as Meshes from "./meshes.js";

let cachedGeometryData: GeometryData | null = null;

export default class Quad extends Polygon {
	constructor(
		graphics: Graphics,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		if (cachedGeometryData === null) {
			cachedGeometryData = new GeometryData(graphics, Meshes.QUAD);
		}

		super(graphics, cachedGeometryData, x, y, width, height);
	}
}
