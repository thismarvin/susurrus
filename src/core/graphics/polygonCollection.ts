// eslint-disable-next-line no-unused-vars
import Polygon from "./polygon.js";
// eslint-disable-next-line no-unused-vars
import PolygonEffect from "./polygonEffect.js";
import PolygonElements from "./polygonElements.js";
import PolygonElementsInstanced from "./polygonElementsInstanced.js";
import BatchExecution from "./batchExecution.js";
import DrawCollection from "./drawCollection.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../lib/graphics.js";

export default class PolygonCollection extends DrawCollection<Polygon> {
	#polygonEffect: PolygonEffect;

	constructor(
		graphics: Graphics.GraphicsManager,
		polygonEffect: PolygonEffect,
		batchExecution: number,
		batchSize: number,
		entries?: Polygon[]
	) {
		super(graphics, batchExecution, batchSize);

		this.#polygonEffect = polygonEffect;

		if (entries !== undefined) {
			this.addRange(entries);
			this.applyChanges();
		}
	}

	protected createDrawGroup(polygon: Polygon) {
		if (polygon.geometryData === null) {
			throw new TypeError(
				"The given polygon does not have any geometry; cannot create draw group."
			);
		}

		switch (this.batchExecution) {
			case BatchExecution.DRAW_ELEMENTS:
				return new PolygonElements(
					this.graphics,
					this.#polygonEffect,
					this.batchSize,
					polygon.geometryData
				);
			case BatchExecution.DRAW_ELEMENTS_INSTANCED:
				return new PolygonElementsInstanced(
					this.graphics,
					this.#polygonEffect,
					this.batchSize,
					polygon.geometryData
				);
		}

		throw new TypeError("Unknown batch execution type.");
	}
}
