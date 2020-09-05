import BatchExecution from "./batchExecution.js";
import DrawCollection from "./drawCollection.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometryData.js";
// eslint-disable-next-line no-unused-vars
import Sprite from "./sprite.js";
// eslint-disable-next-line no-unused-vars
import SpriteEffect from "./spriteEffect.js";
import SpriteElements from "./spriteElements.js";
import SpriteElementsInstanced from "./spriteElementsInstanced.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../lib/graphics.js";

export default class SpriteCollection extends DrawCollection<Sprite> {
	#spriteEffect: SpriteEffect;
	#spriteGeometry: GeometryData;

	constructor(
		graphics: Graphics.GraphicsManager,
		spriteEffect: SpriteEffect,
		spriteGeometry: GeometryData,
		batchExecution: number,
		batchSize: number,
		entries?: Sprite[]
	) {
		super(graphics, batchExecution, batchSize);

		this.#spriteEffect = spriteEffect;
		this.#spriteGeometry = spriteGeometry;

		if (entries !== undefined) {
			this.addRange(entries);
			this.applyChanges();
		}
	}

	protected createDrawGroup(sprite: Sprite) {
		if (sprite.texture === null) {
			throw new TypeError(
				"The given sprite does not have a texture; cannot create draw group."
			);
		}

		switch (this.batchExecution) {
			case BatchExecution.DRAW_ELEMENTS:
				return new SpriteElements(
					this.graphics,
					this.#spriteEffect,
					this.batchSize,
					this.#spriteGeometry,
					sprite.texture
				);
			case BatchExecution.DRAW_ELEMENTS_INSTANCED:
				return new SpriteElementsInstanced(
					this.graphics,
					this.#spriteEffect,
					this.batchSize,
					this.#spriteGeometry,
					sprite.texture
				);
		}

		throw new TypeError("Unknown batch execution type.");
	}
}
