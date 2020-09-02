import Batcher from "../batcher.js";
import BatchExecution from "../batchExecution.js";
// eslint-disable-next-line no-unused-vars
import Polygon from "./polygon.js";
// eslint-disable-next-line no-unused-vars
import PolygonEffect from "./polygonEffect.js";
import PolygonCollection from "./polygonCollection.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../../lib/graphics.js";

const _maxBatchSize = 4096;

export default class PolygonBatcher extends Batcher<Polygon> {
	#polygonEffect: PolygonEffect;
	#polygons: Polygon[][];
	#index: number;

	constructor(
		graphics: Graphics.GraphicsManager,
		polygonEffect: PolygonEffect
	) {
		super(graphics);

		this.#polygonEffect = polygonEffect;
		this.#polygons = [];
		this.#index = 0;
	}

	public begin() {
		this.#polygons.splice(0);

		this.#polygons.push([]);
		this.#index = 0;

		return this;
	}

	public add(polygon: Polygon) {
		this.#polygons[this.#polygons.length - 1].push(polygon);
		this.#index++;

		if (this.#index > this.batchSize) {
			this.#polygons.push([]);
			this.#index = 0;
		}

		return this;
	}

	public end() {
		if (this.camera === null) {
			throw new TypeError(
				"A camera has not been attached yet. Make sure to call attachCamera(camera)."
			);
		}

		for (let i = 0; i < this.#polygons.length; i++) {
			const batchSize =
				i + 1 === this.#polygons.length ? this.#index : this.batchSize;

			const polygonCollection = new PolygonCollection(
				this.graphics,
				this.#polygonEffect,
				this.batchExecution,
				batchSize,
				this.#polygons[i]
			);
			polygonCollection.draw(this.camera);
		}

		this.camera = null;
		this.batchExecution = BatchExecution.DRAW_ELEMENTS;
		this.batchSize = _maxBatchSize;

		return this;
	}
}
