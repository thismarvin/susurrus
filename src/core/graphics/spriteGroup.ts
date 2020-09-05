import DrawGroup from "./drawGroup.js";
// eslint-disable-next-line no-unused-vars
import Sprite from "./sprite.js";
// eslint-disable-next-line no-unused-vars
import SpriteEffect from "./spriteEffect.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../lib/graphics.js";

export default abstract class SpriteGroup extends DrawGroup<Sprite> {
	protected readonly transformSize: number;
	protected readonly colorSize: number;
	protected readonly textureSize: number;

	protected spriteEffect: SpriteEffect;

	constructor(
		graphics: Graphics.GraphicsManager,
		spriteEffect: SpriteEffect,
		batchExecution: number,
		batchSize: number
	) {
		super(graphics, batchExecution, batchSize);

		this.transformSize = 12;
		this.colorSize = 4;
		this.textureSize = 8;

		this.spriteEffect = spriteEffect;

		Object.defineProperty(this, "transformSize", {
			writable: false,
		});
		Object.defineProperty(this, "colorSize", {
			writable: false,
		});
		Object.defineProperty(this, "textureSize", {
			writable: false,
		});
	}

	protected calculateTransformData(sprite: Sprite) {
		return [
			sprite.width * sprite.scale.x,
			sprite.height * sprite.scale.y,
			sprite.scale.z,
			sprite.position.x + sprite.translation.x,
			sprite.position.y + sprite.translation.y,
			sprite.position.z + sprite.translation.z,
			sprite.origin.x,
			sprite.origin.y,
			sprite.origin.z,
			sprite.rotation.x,
			sprite.rotation.y,
			sprite.rotation.z,
		];
	}

	protected calculateColorData(sprite: Sprite) {
		return sprite.tint.toArray();
	}

	protected calculateTextureData(sprite: Sprite) {
		return Sprite.calculateTextureCoords(sprite);
	}
}
