import * as Graphics from "../../../lib/graphics.js";
import * as Maths from "../../../lib/maths.js";
import * as Utilities from "../../../lib/utilities.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometryData.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../../camera.js";

const ATTRIBUTE_SCHEMA = new Graphics.AttributeSchema([
	new Graphics.AttributeElement(
		"a_translation",
		3,
		Graphics.AttributeType.FLOAT
	),
	new Graphics.AttributeElement("a_scale", 3, Graphics.AttributeType.FLOAT),
	new Graphics.AttributeElement(
		"a_rotationOffset",
		3,
		Graphics.AttributeType.FLOAT
	),
	new Graphics.AttributeElement("a_rotation", 1, Graphics.AttributeType.FLOAT),
	new Graphics.AttributeElement("a_color", 4, Graphics.AttributeType.FLOAT),
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

	#translation: Maths.Vector3;
	#scale: Maths.Vector3;
	#rotationOffset: Maths.Vector3;
	#rotation: number;
	#color: Graphics.Color;

	#geometry: GeometryData;
	#model: Graphics.VertexBuffer;
	#transformChanged: boolean;

	constructor(
		graphics: Graphics.GraphicsManager,
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
		this.#translation = new Maths.Vector3(0, 0, 0);
		this.#scale = new Maths.Vector3(1, 1, 1);
		this.#rotationOffset = new Maths.Vector3(0, 0, 0);
		this.#rotation = 0;
		this.#color = new Graphics.Color(0xffffff);

		// I hate this but for some reason Blink doesnt bode well with VertexUsage.DYNAMIC.
		// Refer to this issue for more info: https://github.com/thismarvin/susurrus/issues/5
		let modelLength = ATTRIBUTE_SCHEMA.size;
		if (Utilities.BrowserDetection.IS_BLINK) {
			modelLength *= this.#geometry.totalVertices;
		}

		this.#model = new Graphics.VertexBuffer(
			graphics,
			ATTRIBUTE_SCHEMA,
			modelLength,
			Graphics.VertexUsage.DYNAMIC,
			1
		);

		this.updateBuffer();
		this.#transformChanged = false;
	}

	public applyChanges() {
		this.#transformChanged = false;
		this.updateBuffer();
	}

	public draw(
		graphics: Graphics.GraphicsManager,
		effect: Graphics.Effect,
		camera: Camera
	) {
		// Ideally this would always be false, but I'll just keep this here in case the user ever forgets to applyChanges themselves.
		if (this.#transformChanged) {
			this.applyChanges();
		}

		graphics.begin(effect);

		graphics.setVertexBuffers([this.#geometry.vertexBuffer, this.#model]);
		graphics.setIndexBuffer(this.#geometry.indexBuffer);

		graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);

		graphics.drawElements(
			Graphics.DrawMode.TRIANGLES,
			this.#geometry.totalTriangles,
			0
		);

		graphics.end();
	}

	private updateBuffer() {
		let bufferData: number[] = [];
		bufferData = bufferData.concat(
			new Maths.Vector3(
				this.#x + this.translation.x,
				this.#y + this.translation.y,
				this.#x + this.translation.z
			).toArray()
		);
		bufferData = bufferData.concat(
			new Maths.Vector3(
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