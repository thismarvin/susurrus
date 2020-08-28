import {
	AttributeElement,
	AttributeSchema,
	AttributeType,
	DrawMode,
	// eslint-disable-next-line no-unused-vars
	Effect,
	// eslint-disable-next-line no-unused-vars
	GraphicsManager,
	// eslint-disable-next-line no-unused-vars
	Texture2D,
	VertexBuffer,
	VertexUsage,
} from "../../lib/graphics.js";
import * as Utilities from "../../lib/utilities.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometry/geometryData.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../camera.js";

const _attributeSchemaTexture = new AttributeSchema([
	new AttributeElement("a_textureCoord", 2, AttributeType.FLOAT),
]);

const _attributeSchemaModel = new AttributeSchema([
	new AttributeElement("a_scale", 3, AttributeType.FLOAT),
]);

export default class Sprite {
	#texture: Texture2D;
	#geometryData: GeometryData | null;
	#effect: Effect | null;

	#textureBuffer: VertexBuffer | null;
	#modelBuffer: VertexBuffer | null;

	constructor(texture: Texture2D) {
		this.#texture = texture;
		this.#geometryData = null;
		this.#effect = null;

		this.#textureBuffer = null;
		this.#modelBuffer = null;
	}

	public attachGeometry(geometry: GeometryData) {
		this.#geometryData = geometry;

		return this;
	}

	public attachEffect(effect: Effect) {
		this.#effect = effect;

		return this;
	}

	public createTextureBuffer(graphics: GraphicsManager) {
		this.#textureBuffer = new VertexBuffer(
			graphics,
			_attributeSchemaTexture,
			8,
			VertexUsage.STATIC
		);
		this.#textureBuffer.setData([0, 0, 1, 0, 1, 1, 0, 1]);

		let modelLength = _attributeSchemaModel.size;
		if (Utilities.BrowserDetection.IS_BLINK) {
			modelLength *= 6;
		}
		this.#modelBuffer = new VertexBuffer(
			graphics,
			_attributeSchemaModel,
			modelLength,
			VertexUsage.DYNAMIC,
			1
		);
		this.#modelBuffer.setData([this.#texture.width, this.#texture.height, 1]);

		return this;
	}

	public draw(graphics: GraphicsManager, camera: Camera) {
		if (
			this.#texture.data === null ||
			this.#geometryData === null ||
			this.#effect === null ||
			this.#textureBuffer === null ||
			this.#modelBuffer === null
		) {
			return;
		}

		graphics
			.begin(this.#effect)
			.setVertexBuffer(
				this.#geometryData.vertexBuffer,
				this.#textureBuffer,
				this.#modelBuffer
			)
			.setIndexBuffer(this.#geometryData.indexBuffer)
			.setUniform("worldViewProjection", camera.wvp.data)
			.setUniform2("sampler")
			.setTexture(this.#texture.data)
			.drawElements(DrawMode.TRIANGLES, this.#geometryData.totalTriangles, 0)
			.end();
	}
}
