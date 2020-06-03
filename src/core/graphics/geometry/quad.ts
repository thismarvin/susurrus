// eslint-disable-next-line no-unused-vars
import Polygon from "./polygon.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../../lib/graphics.js";
import GeometryData from "./geometryData.js";
import * as Meshes from "./meshes.js";

let _cachedGeometryData: GeometryData | null = null;

export default class Quad extends Polygon {
	constructor(
		graphics: Graphics.GraphicsManager,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		if (_cachedGeometryData === null) {
			_cachedGeometryData = new GeometryData(graphics, Meshes.QUAD);
		}

		super(graphics, _cachedGeometryData, x, y, width, height);
	}
}