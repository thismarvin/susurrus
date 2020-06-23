// eslint-disable-next-line no-unused-vars
import { GraphicsManager } from "../lib/graphics.js";
// eslint-disable-next-line no-unused-vars
import Theater from "./theater.js";
import Quad from "./graphics/geometry/quad.js";
import Circle from "./graphics/geometry/circle.js";
import PolygonEffect from "./graphics/geometry/polygonEffect.js";

export default class Factory {
	#theater: Theater;
	#graphics: GraphicsManager | null;

	#sharedPolygonEffect: PolygonEffect | null;

	constructor(theater: Theater) {
		this.#theater = theater;
		this.#graphics = null;
		this.#sharedPolygonEffect = null;
	}

	public attachGraphics(graphics: GraphicsManager) {
		this.#graphics = graphics;

		this.#sharedPolygonEffect = new PolygonEffect(this.#graphics);
	}

	public createCircle(x: number, y: number, radius: number) {
		if (this.#graphics === null) {
			throw new TypeError(
				"A GraphicsManager has not been attached; cannot create geometry. Make sure to call 'attachGraphics(graphics)' before using a Factory."
			);
		}
		if (this.#sharedPolygonEffect === null) {
			throw new Error(
				"Something went wrong! Could not create shared PolygonEffect."
			);
		}

		const circle = new Circle(x, y, radius);
		circle.attachEffect(this.#sharedPolygonEffect);
		//@ts-ignore
		circle.geometryData = this.#theater.geometryManager.getGeometry(
			"Susurrus_Circle"
		);
		circle.createModel(this.#graphics);

		return circle;
	}

	public createQuad(x: number, y: number, width: number, height: number) {
		if (this.#graphics === null) {
			throw new TypeError(
				"A GraphicsManager has not been attached; cannot create geometry. Make sure to call 'attachGraphics(graphics)' before using a Factory."
			);
		}
		if (this.#sharedPolygonEffect === null) {
			throw new Error(
				"Something went wrong! Could not create shared PolygonEffect."
			);
		}

		const quad = new Quad(x, y, width, height);
		quad.attachEffect(this.#sharedPolygonEffect);
		//@ts-ignore
		quad.geometryData = this.#theater.geometryManager.getGeometry(
			"Susurrus_Square"
		);
		quad.createModel(this.#graphics);

		return quad;
	}
}
