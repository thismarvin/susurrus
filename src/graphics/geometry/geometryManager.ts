import GeometryData from "./geometryData.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "../graphicsManager.js";
// eslint-disable-next-line no-unused-vars
import Mesh from "../mesh.js";

export default class GeometryManager {
	public readonly shapes: Map<string, GeometryData>;

	#graphics: Graphics;

	constructor(graphics: Graphics) {
		this.#graphics = graphics;
		this.shapes = new Map<string, GeometryData>();

		Object.defineProperty(this, "shapes", {
			writable: false,
		});
	}

	public createGeometryData(mesh: Mesh) {
		return new GeometryData(this.#graphics, mesh);
	}

	public registerGeometry(name: string, geometryData: GeometryData) {
		if (this.shapes.has(name)) {
			throw new TypeError(
				"GeometryData with that name has already been registered."
			);
		}

		this.shapes.set(name, geometryData);
	}

	public getGeometry(name: string) {
		if (!this.shapes.has(name)) {
			throw new TypeError(
				"GeometryData with that name has not been registered."
			);
		}

		return this.shapes.get(name);
	}
}
