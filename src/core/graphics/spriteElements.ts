import * as AttributeSchemas from "./geometry/attributeSchemas.js";
import BatchExecution from "./batchExecution.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../camera.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometry/geometryData.js";
// eslint-disable-next-line no-unused-vars
import Sprite from "./sprite.js";
// eslint-disable-next-line no-unused-vars
import SpriteEffect from "./spriteEffect.js";
import SpriteGroup from "./spriteGroup.js";
import * as Graphics from "../../lib/graphics.js";

export default class SpriteElements extends SpriteGroup {
	#sharedGeometry: GeometryData;
	#sharedTexture: Graphics.Texture2D;

	#vertexPositions: number[];
	#transforms: number[];
	#colors: number[];
	#textureCoords: number[];

	#count: number;
	#totalPrimitives: number;
	#dataModified: boolean;

	#indices: number[];
	#indexBuffer: Graphics.IndexBuffer;

	#vertexPositionBuffer: Graphics.VertexBuffer | null;
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
		super(graphics, spriteEffect, BatchExecution.DRAW_ELEMENTS, batchSize);

		this.#sharedGeometry = sharedGeometry;
		this.#sharedTexture = sharedTexture;

		const totalVertices = this.#sharedGeometry.mesh.totalVertices;
		const totalIndices = this.#sharedGeometry.mesh.totalIndices;

		this.#vertexPositions = new Array(this.batchSize * totalVertices * 3).fill(
			0
		);
		this.#transforms = new Array(
			this.batchSize * totalVertices * this.transformSize
		).fill(0);
		this.#colors = new Array(
			this.batchSize * totalVertices * this.colorSize
		).fill(0);
		this.#textureCoords = new Array(
			this.batchSize * totalVertices * this.textureSize
		).fill(0);

		this.#count = 0;
		this.#totalPrimitives = 0;
		this.#dataModified = false;

		this.#indices = new Array(this.batchSize * totalIndices).fill(0);
		for (let i = 0; i < this.batchSize; i++) {
			const start = totalIndices * i;
			const buffer = totalVertices * i;

			for (let j = 0; j < totalIndices; j++) {
				this.#indices[start + j] =
					buffer + this.#sharedGeometry.mesh.indices[j];
			}
		}

		this.#indexBuffer = new Graphics.IndexBuffer(
			this.graphics,
			this.#indices.length
		);
		this.#indexBuffer.setData(this.#indices);

		this.#vertexPositionBuffer = null;
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

		const vertexPositionIndex =
			this.#count * this.#sharedGeometry.mesh.vertices.length;

		for (let i = 0; i < this.#sharedGeometry.mesh.vertices.length; i++) {
			this.#vertexPositions[
				vertexPositionIndex + i
			] = this.#sharedGeometry.mesh.vertices[i];
		}

		const transformIndex =
			this.#count * transform.length * this.#sharedGeometry.totalVertices;

		for (let i = 0; i < this.#sharedGeometry.totalVertices; i++) {
			for (let j = 0; j < transform.length; j++) {
				this.#transforms[transformIndex + i * transform.length + j] =
					transform[j];
			}
		}

		const colorIndex =
			this.#count * color.length * this.#sharedGeometry.totalVertices;

		for (let i = 0; i < this.#sharedGeometry.totalVertices; i++) {
			for (let j = 0; j < color.length; j++) {
				this.#colors[colorIndex + i * color.length + j] = color[j];
			}
		}

		const textureIndex =
			this.#count * textureCoords.length * this.#sharedGeometry.totalVertices;

		for (let i = 0; i < this.#sharedGeometry.totalVertices; i++) {
			for (let j = 0; j < textureCoords.length; j++) {
				this.#textureCoords[textureIndex + i * textureCoords.length + j] =
					textureCoords[j];
			}
		}

		this.#count++;
		this.#totalPrimitives += this.#sharedGeometry.totalTriangles;

		this.#dataModified = true;

		return true;
	}

	public applyChanges() {
		if (!this.#dataModified) {
			return;
		}

		const vertexCount = this.#count * this.#sharedGeometry.totalVertices;

		this.#vertexPositionBuffer = new Graphics.VertexBuffer(
			this.graphics,
			AttributeSchemas.VERTEX_POSITION,
			vertexCount * 3,
			Graphics.VertexUsage.DYNAMIC
		);
		this.#transformBuffer = new Graphics.VertexBuffer(
			this.graphics,
			AttributeSchemas.TRANSFORM,
			vertexCount * this.transformSize,
			Graphics.VertexUsage.DYNAMIC
		);
		this.#colorBuffer = new Graphics.VertexBuffer(
			this.graphics,
			AttributeSchemas.COLOR,
			vertexCount * this.colorSize,
			Graphics.VertexUsage.DYNAMIC
		);
		this.#textureCoordBuffer = new Graphics.VertexBuffer(
			this.graphics,
			AttributeSchemas.TEXTURE_COORD,
			vertexCount * this.textureSize,
			Graphics.VertexUsage.DYNAMIC
		);

		this.#vertexPositionBuffer.setData(
			this.#vertexPositions.slice(0, vertexCount * 3)
		);
		this.#transformBuffer.setData(
			this.#transforms.slice(0, vertexCount * this.transformSize)
		);
		this.#colorBuffer.setData(
			this.#colors.slice(0, vertexCount * this.colorSize)
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
			this.#vertexPositionBuffer === null ||
			this.#transformBuffer === null ||
			this.#colorBuffer === null ||
			this.#textureCoordBuffer === null
		) {
			return;
		}

		this.graphics
			.begin(this.spriteEffect)
			.setVertexBuffer(
				this.#vertexPositionBuffer,
				this.#transformBuffer,
				this.#colorBuffer,
				this.#textureCoordBuffer
			)
			.setIndexBuffer(this.#indexBuffer)
			.setUniform("worldViewProjection", camera.wvp.data)
			.setUniform2("sampler")
			.setTexture(this.#sharedTexture.data)
			.drawElements(Graphics.DrawMode.TRIANGLES, this.#totalPrimitives, 0)
			.disableVertexBuffer(
				this.#vertexPositionBuffer,
				this.#transformBuffer,
				this.#colorBuffer,
				this.#textureCoordBuffer
			)
			.end();
	}

	protected onDispose() {
		this.#vertexPositionBuffer?.dispose();
		this.#transformBuffer?.dispose();
		this.#colorBuffer?.dispose();
		this.#textureCoordBuffer?.dispose();
		this.#indexBuffer?.dispose();
	}
}
