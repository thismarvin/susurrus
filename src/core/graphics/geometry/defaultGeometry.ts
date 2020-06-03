// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../../lib/graphics.js";
import GeometryData from "./geometryData.js";
import * as Meshes from "./meshes.js";

export default class DefaultGeometry {
	public readonly square: GeometryData;
	public readonly triangle: GeometryData;
	public readonly circle: GeometryData;

	constructor(graphics: Graphics.GraphicsManager) {
		this.square = new GeometryData(graphics, Meshes.QUAD);
		this.triangle = new GeometryData(graphics, Meshes.TRIANGLE);
		this.circle = new GeometryData(graphics, Meshes.CIRCLE);

		Object.defineProperty(this, "square", {
			writable: false,
		});
		Object.defineProperty(this, "triangle", {
			writable: false,
		});
		Object.defineProperty(this, "circle", {
			writable: false,
		});
	}
}
