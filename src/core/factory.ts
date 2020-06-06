// eslint-disable-next-line no-unused-vars
import Theater from "./theater.js";
import Quad from "./graphics/geometry/quad.js";
import Circle from "./graphics/geometry/circle.js";

export default class Factory {
	#theater: Theater;

	constructor(theater: Theater) {
		this.#theater = theater;
	}

	public createCircle(x: number, y: number, radius: number) {
		if (this.#theater.graphics === null) {
			throw new TypeError(
				"The GraphicsManager has not been instantiated; cannot create geometry. Make sure to call Theater's appendCanvas() before using a Factory."
			);
		}

		const circle = new Circle(x, y, radius);
		//@ts-ignore
		circle.geometryData = this.#theater.geometryManager.getGeometry(
			"Susurrus_Circle"
		);
		circle.createModel(this.#theater.graphics);
		return circle;
	}

	public createQuad(x: number, y: number, width: number, height: number) {
		if (this.#theater.graphics === null) {
			throw new TypeError(
				"The GraphicsManager has not been instantiated; cannot create geometry. Make sure to call Theater's appendCanvas() before using a Factory."
			);
		}

		const quad = new Quad(x, y, width, height);
		//@ts-ignore
		quad.geometryData = this.#theater.geometryManager.getGeometry(
			"Susurrus_Square"
		);
		quad.createModel(this.#theater.graphics);
		return quad;
	}
}
