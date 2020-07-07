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
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometry/geometryData.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../camera.js";

const _attributeSchema = new AttributeSchema([
	new AttributeElement("a_textureCoord", 2, AttributeType.FLOAT),
]);

export default class Sprite {
	#texture: Texture2D;
	#geometryData: GeometryData | null;
	#effect: Effect | null;

	#textureBuffer: VertexBuffer | null;

	constructor(texture: Texture2D) {
		this.#texture = texture;
		this.#geometryData = null;
		this.#effect = null;

		this.#textureBuffer = null;
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
			_attributeSchema,
			8,
			VertexUsage.STATIC
		);
		this.#textureBuffer.setData([0, 0, 1, 0, 1, 1, 0, 1]);

		return this;
	}

	public draw(graphics: GraphicsManager, camera: Camera) {
		if (
			this.#texture.data === null ||
			this.#geometryData === null ||
			this.#effect === null ||
			this.#textureBuffer === null
		) {
			return;
		}

		graphics
			.begin(this.#effect)
			.setVertexBuffer(this.#geometryData.vertexBuffer, this.#textureBuffer)
			.setIndexBuffer(this.#geometryData.indexBuffer)
			.setUniform("worldViewProjection", camera.wvp.data)
			.setUniform2("sampler")
			.setTexture(this.#texture.data)
			.drawElements(DrawMode.TRIANGLES, this.#geometryData.totalTriangles, 0)
			.end();
	}
}
