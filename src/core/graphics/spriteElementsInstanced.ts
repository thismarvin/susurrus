import * as AttributeSchemas from "./attributeSchemas.js";
import BatchExecution from "./batchExecution.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../camera.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometryData.js";
// eslint-disable-next-line no-unused-vars
import Sprite from "./sprite.js";
// eslint-disable-next-line no-unused-vars
import SpriteEffect from "./spriteEffect.js";
import SpriteGroup from "./spriteGroup.js";
import * as Graphics from "../../lib/graphics.js";

export default class SpriteElementsInstanced extends SpriteGroup {
	#sharedGeometry: GeometryData;
	#sharedTexture: Graphics.Texture2D;

	#transforms: number[];
	#colors: number[];
	#textureCoords: number[];

	#count: number;
	#dataModified: boolean;

	#transformBuffer: Graphics.VertexBuffer | null;
	#colorBuffer: Graphics.VertexBuffer | null;
	#textureCoordBuffer: Graphics.VertexBuffer | null;

	constructor(
		graphics: Graphics.GraphicsManager,
		spriteEffect: SpriteEffect,
		batchSize: number,
		sharedGeometry: GeometryData,
		sharedTexture: Graphics.Texture2D
	) {
		super(
			graphics,
			spriteEffect,
			BatchExecution.DRAW_ELEMENTS_INSTANCED,
			batchSize
		);

		this.#sharedGeometry = sharedGeometry;
		this.#sharedTexture = sharedTexture;

		const totalVertices = 4;

		this.#transforms = new Array(this.batchSize * this.transformSize).fill(0);
		this.#colors = new Array(this.batchSize * this.colorSize).fill(0);
		this.#textureCoords = new Array(
			this.batchSize * totalVertices * this.textureSize
		).fill(0);

		this.#count = 0;
		this.#dataModified = false;

		this.#transformBuffer = null;
		this.#colorBuffer = null;
		this.#textureCoordBuffer = null;
	}

	public add(sprite: Sprite) {
		if (this.#count >= this.batchSize) return false;

		if (sprite.texture != this.#sharedTexture) return false;

		const transform = this.calculateTransformData(sprite);
		const color = this.calculateColorData(sprite);
		const textureCoords = this.calculateTextureData(sprite);

		const transformIndex = this.#count * transform.length;

		for (let i = 0; i < transform.length; i++) {
			this.#transforms[transformIndex + i] = transform[i];
		}

		const colorIndex = this.#count * color.length;

		for (let i = 0; i < color.length; i++) {
			this.#colors[colorIndex + i] = color[i];
		}

		let textureIndex =
			this.#count * textureCoords.length * this.#sharedGeometry.totalVertices;

		for (let i = 0; i < this.#sharedGeometry.totalVertices; i++) {
			for (let j = 0; j < textureCoords.length; j++) {
				this.#textureCoords[textureIndex + i * textureCoords.length + j] =
					textureCoords[j];
			}
		}

		this.#count++;

		this.#dataModified = true;

		return true;
	}

	public applyChanges() {
		if (!this.#dataModified) {
			return;
		}

		const vertexCount = this.#count * this.#sharedGeometry.totalVertices;

		this.#transformBuffer = new Graphics.VertexBuffer(
			this.graphics,
			AttributeSchemas.TRANSFORM,
			this.#count * this.transformSize,
			Graphics.VertexUsage.DYNAMIC,
			1
		);
		this.#colorBuffer = new Graphics.VertexBuffer(
			this.graphics,
			AttributeSchemas.COLOR,
			this.#count * this.colorSize,
			Graphics.VertexUsage.DYNAMIC,
			1
		);
		this.#textureCoordBuffer = new Graphics.VertexBuffer(
			this.graphics,
			AttributeSchemas.TEXTURE_COORD,
			vertexCount * this.textureSize,
			Graphics.VertexUsage.DYNAMIC
		);

		this.#transformBuffer.setData(
			this.#transforms.slice(0, this.#count * this.transformSize)
		);
		this.#colorBuffer.setData(
			this.#colors.slice(0, this.#count * this.colorSize)
		);
		this.#textureCoordBuffer.setData(
			this.#textureCoords.slice(0, vertexCount * this.textureSize)
		);

		this.#dataModified = false;
	}

	public draw(camera: Camera) {
		if (this.#dataModified) {
			throw new Error(
				"The sprite group was modified, but applyChanges() was never called."
			);
		}

		if (
			this.#sharedTexture.data === null ||
			this.#transformBuffer === null ||
			this.#colorBuffer === null ||
			this.#textureCoordBuffer === null
		) {
			return;
		}

		this.graphics
			.begin(this.spriteEffect)
			.setVertexBuffer(
				this.#sharedGeometry.vertexBuffer,
				this.#transformBuffer,
				this.#colorBuffer,
				this.#textureCoordBuffer
			)
			.setIndexBuffer(this.#sharedGeometry.indexBuffer)
			.setUniform("worldViewProjection", camera.wvp.data)
			.setUniform2("sampler")
			.setTexture(this.#sharedTexture.data)
			.drawElementsInstanced(
				Graphics.DrawMode.TRIANGLES,
				this.#sharedGeometry.totalTriangles,
				0,
				this.#count
			)
			.disableVertexBuffer(
				this.#transformBuffer,
				this.#colorBuffer,
				this.#textureCoordBuffer
			)
			.end();
	}

	protected onDispose() {
		this.#transformBuffer?.dispose();
		this.#colorBuffer?.dispose();
		this.#textureCoordBuffer?.dispose();
	}
}
