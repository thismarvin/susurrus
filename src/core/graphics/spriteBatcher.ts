import Batcher from "./batcher.js";
import BatchExecution from "./batchExecution.js";
// eslint-disable-next-line no-unused-vars
import Sprite from "./sprite.js";
import SpriteCollection from "./spriteCollection.js";
// eslint-disable-next-line no-unused-vars
import SpriteEffect from "./spriteEffect.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometry/geometryData.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../lib/graphics.js";

const _maxBatchSize = 4096;

export default class SpriteBatcher extends Batcher<Sprite> {
	#spriteEffect: SpriteEffect;
	#spriteGeometry: GeometryData;
	#sprites: Sprite[][];
	#index: number;

	constructor(
		graphics: Graphics.GraphicsManager,
		spriteEffect: SpriteEffect,
		spriteGeometry: GeometryData
	) {
		super(graphics);

		this.#spriteEffect = spriteEffect;
		this.#spriteGeometry = spriteGeometry;
		this.#sprites = [];
		this.#index = 0;
	}

	public begin() {
		// ? I am not sure if I have to include this for loop, but Firefox claims there are thousands of arrays just lying around.
		// ? Including this extra step seems to mitigate that issue.
		for (let i = 0; i < this.#sprites.length; i++) {
			this.#sprites[i].splice(0);
		}

		this.#sprites.splice(0);

		this.#sprites.push([]);
		this.#index = 0;

		return this;
	}

	public add(sprite: Sprite) {
		this.#sprites[this.#sprites.length - 1].push(sprite);
		this.#index++;

		if (this.#index >= this.batchSize) {
			this.#sprites.push([]);
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

		for (let i = 0; i < this.#sprites.length; i++) {
			const batchSize =
				i + 1 === this.#sprites.length ? this.#index : this.batchSize;

			const spriteCollection = new SpriteCollection(
				this.graphics,
				this.#spriteEffect,
				this.#spriteGeometry,
				this.batchExecution,
				batchSize,
				this.#sprites[i]
			);
			spriteCollection.draw(this.camera);
			spriteCollection.dispose();
		}

		this.camera = null;
		this.batchExecution = BatchExecution.DRAW_ELEMENTS;
		this.batchSize = _maxBatchSize;

		return this;
	}
}
