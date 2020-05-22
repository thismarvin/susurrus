import AttributeType from "../attributeType.js";
import AttributeSchema from "../attributeSchema.js";
import AttributeElement from "../attributeElement.js";
import DrawMode from "../drawMode.js";
import VertexUsage from "../vertexUsage.js";
import VertexBuffer from "../vertexBuffer.js";
import Vector3 from "../../maths/vector3.js";
import Color from "../color.js";
// eslint-disable-next-line no-unused-vars
import PolygonData from "./polygonData.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "../graphicsManager.js";
// eslint-disable-next-line no-unused-vars
import Effect from "../effect.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../../camera.js";

const attributeSchema = new AttributeSchema([
	new AttributeElement("a_translation", 3, AttributeType.FLOAT),
	new AttributeElement("a_scale", 3, AttributeType.FLOAT),
	new AttributeElement("a_rotationOffset", 3, AttributeType.FLOAT),
	new AttributeElement("a_rotation", 1, AttributeType.FLOAT),
	new AttributeElement("a_color", 4, AttributeType.FLOAT),
]);

export default class Polygon {
	public readonly geometry: PolygonData;
	public readonly attributeSchema: AttributeSchema;
	public readonly transformBuffer: VertexBuffer;

	get position() {
		return this.#position;
	}
	set position(value) {
		if (value === this.#position) {
			return;
		}

		this.#position = value;
		this.#transformChanged = true;
	}

	get scale() {
		return this.#scale;
	}
	set scale(value) {
		if (value === this.#scale) {
			return;
		}

		this.#scale = value;
		this.#transformChanged = true;
	}

	get rotationOffset() {
		return this.#rotationOffset;
	}
	set rotationOffset(value) {
		if (value === this.#rotationOffset) {
			return;
		}

		this.#rotationOffset = value;
		this.#transformChanged = true;
	}

	get rotation() {
		return this.#rotation;
	}
	set rotation(value) {
		if (value === this.#rotation) {
			return;
		}

		this.#rotation = value;
		this.#transformChanged = true;
	}

	get color() {
		return this.#color;
	}
	set color(value) {
		if (value === this.#color) {
			return;
		}

		this.#color = value;
		this.#transformChanged = true;
	}

	#position: Vector3;
	#scale: Vector3;
	#rotationOffset: Vector3;
	#rotation: number;
	#color: Color;
	#transformChanged: boolean;

	constructor(graphics: Graphics, geometry: PolygonData) {
		this.geometry = geometry;
		this.attributeSchema = attributeSchema;

		this.#position = new Vector3(0, 0, 0);
		this.#scale = new Vector3(1, 1, 1);
		this.#rotationOffset = new Vector3(0, 0, 0);
		this.#rotation = 0;
		this.#color = new Color(0xffffff);

		this.transformBuffer = new VertexBuffer(
			graphics,
			this.attributeSchema,
			this.attributeSchema.size * 1,
			VertexUsage.DYNAMIC,
			1
		);

		this.updateBuffer();
		this.#transformChanged = false;

		Object.defineProperty(this, "geometry", {
			writable: false,
		});
		Object.defineProperty(this, "attributeSchema", {
			writable: false,
		});
		Object.defineProperty(this, "transformBuffer", {
			writable: false,
		});
	}

	public applyChanges() {
		// if (!this.#transformChanged) {
		// 	return;
		// }

		this.#transformChanged = false;
		this.updateBuffer();
	}

	public draw(graphics: Graphics, effect: Effect, camera: Camera) {
		// Ideally this would always be false, but I'll just keep this here in case the user ever forgets to applyChanges themselves.
		if (this.#transformChanged) {
			this.applyChanges();
		}

		graphics.begin(effect);

		graphics.setVertexBuffers([
			this.geometry.vertexBuffer,
			this.transformBuffer,
		]);
		graphics.setIndexBuffer(this.geometry.indexBuffer);

		graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);

		graphics.drawElements(DrawMode.TRIANGLES, this.geometry.totalTriangles, 0);

		graphics.end();
	}

	private updateBuffer() {
		let bufferData: number[] = [];
		bufferData = bufferData.concat(this.#position.toArray());
		bufferData = bufferData.concat(this.#scale.toArray());
		bufferData = bufferData.concat(this.#rotationOffset.toArray());
		bufferData = bufferData.concat(this.#rotation);
		bufferData = bufferData.concat(this.#color.toArray());

		this.transformBuffer.setData(bufferData);
	}
}
