// eslint-disable-next-line no-unused-vars
import Graphics from "../graphicsManager.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometryData.js";
import Color from "../color.js";
import VertexBuffer from "../vertexBuffer.js";
import AttributeType from "../attributeType.js";
import AttributeSchema from "../attributeSchema.js";
import AttributeElement from "../attributeElement.js";
import DrawMode from "../drawMode.js";
import VertexUsage from "../vertexUsage.js";
// eslint-disable-next-line no-unused-vars
import Effect from "../effect.js";
import Vector3 from "../../maths/vector3.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../../camera.js";
import * as BrowserHelper from "../../utilities/browserDetection.js";

const ATTRIBUTE_SCHEMA = new AttributeSchema([
	new AttributeElement("a_translation", 3, AttributeType.FLOAT),
	new AttributeElement("a_scale", 3, AttributeType.FLOAT),
	new AttributeElement("a_rotationOffset", 3, AttributeType.FLOAT),
	new AttributeElement("a_rotation", 1, AttributeType.FLOAT),
	new AttributeElement("a_color", 4, AttributeType.FLOAT),
]);

export default abstract class Polygon {
	//#region Getters and Setters
	get x() {
		return this.#x;
	}
	set x(value) {
		if (value === this.#x) {
			return;
		}

		this.#x = value;
		this.#transformChanged = true;
	}

	get y() {
		return this.#y;
	}
	set y(value) {
		if (value === this.#y) {
			return;
		}

		this.#y = value;
		this.#transformChanged = true;
	}

	get width() {
		return this.#width;
	}
	set width(value) {
		if (value === this.#width) {
			return;
		}

		this.#width = value;
		this.#transformChanged = true;
	}

	get height() {
		return this.#height;
	}
	set height(value) {
		if (value === this.#height) {
			return;
		}

		this.#height = value;
		this.#transformChanged = true;
	}

	get translation() {
		return this.#translation;
	}
	set translation(value) {
		if (value === this.#translation) {
			return;
		}

		this.#translation = value;
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
	//#endregion

	#x: number;
	#y: number;
	#width: number;
	#height: number;

	#translation: Vector3;
	#scale: Vector3;
	#rotationOffset: Vector3;
	#rotation: number;
	#color: Color;

	#geometry: GeometryData;
	#model: VertexBuffer;
	#transformChanged: boolean;

	constructor(
		graphics: Graphics,
		geometry: GeometryData,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.#geometry = geometry;
		this.#x = x;
		this.#y = y;
		this.#width = width;
		this.#height = height;

		// ? Do we really need a sperate translation? It is basically just position...
		this.#translation = new Vector3(0, 0, 0);
		this.#scale = new Vector3(1, 1, 1);
		this.#rotationOffset = new Vector3(0, 0, 0);
		this.#rotation = 0;
		this.#color = new Color(0xffffff);

		// I hate this but for some reason Blink doesnt bode well with VertexUsage.DYNAMIC.
		// Refer to this issue for more info: https://github.com/thismarvin/susurrus/issues/5
		let modelLength = ATTRIBUTE_SCHEMA.size;
		if (BrowserHelper.IS_BLINK) {
			modelLength *= this.#geometry.totalVertices;
		}

		this.#model = new VertexBuffer(
			graphics,
			ATTRIBUTE_SCHEMA,
			modelLength,
			VertexUsage.DYNAMIC,
			1
		);

		this.updateBuffer();
		this.#transformChanged = false;
	}

	public applyChanges() {
		this.#transformChanged = false;
		this.updateBuffer();
	}

	public draw(graphics: Graphics, effect: Effect, camera: Camera) {
		// Ideally this would always be false, but I'll just keep this here in case the user ever forgets to applyChanges themselves.
		if (this.#transformChanged) {
			this.applyChanges();
		}

		graphics.begin(effect);

		graphics.setVertexBuffers([this.#geometry.vertexBuffer, this.#model]);
		graphics.setIndexBuffer(this.#geometry.indexBuffer);

		graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);

		graphics.drawElements(DrawMode.TRIANGLES, this.#geometry.totalTriangles, 0);

		graphics.end();
	}

	private updateBuffer() {
		let bufferData: number[] = [];
		bufferData = bufferData.concat(
			new Vector3(
				this.#x + this.translation.x,
				this.#y + this.translation.y,
				this.#x + this.translation.z
			).toArray()
		);
		bufferData = bufferData.concat(
			new Vector3(
				this.#width * this.#scale.x,
				this.#height * this.#scale.y,
				this.#scale.z
			).toArray()
		);
		bufferData = bufferData.concat(this.#rotationOffset.toArray());
		bufferData = bufferData.concat(this.#rotation);
		bufferData = bufferData.concat(this.#color.toArray());

		this.#model.setData(bufferData);
	}
}
