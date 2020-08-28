// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../../lib/graphics.js";
import * as Utilities from "../../../lib/utilities.js";
import * as Meshes from "./meshes.js";
import GeometryData from "./geometryData.js";

export default class GeometryManager {
	#graphics: Graphics.GraphicsManager;
	#geometry: Utilities.ResourceHandler<GeometryData>;

	constructor(graphics: Graphics.GraphicsManager) {
		this.#graphics = graphics;
		this.#geometry = new Utilities.ResourceHandler<GeometryData>();

		this.createDefaults();
	}

	public registerGeometry(name: string, geometry: GeometryData) {
		this.#geometry.register(name, geometry);

		return this;
	}

	public getGeometry(name: string) {
		return this.#geometry.get(name);
	}

	public removeGeometry(name: string) {
		this.#geometry.remove(name);

		return this;
	}

	private createDefaults() {
		this.registerGeometry(
			"Susurrus_Circle",
			new GeometryData(this.#graphics, Meshes.CIRCLE)
		);
		this.registerGeometry(
			"Susurrus_Square",
			new GeometryData(this.#graphics, Meshes.SQUARE)
		);
		this.registerGeometry(
			"Susurrus_Triangle",
			new GeometryData(this.#graphics, Meshes.TRIANGLE)
		);
	}
}
