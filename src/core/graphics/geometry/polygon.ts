import * as Graphics from "../../../lib/graphics.js";
import * as Maths from "../../../lib/maths.js";
import * as Utilities from "../../../lib/utilities.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometryData.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../../camera.js";

const _attributeSchema = new Graphics.AttributeSchema([
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
	public geometryData: GeometryData | null;

	//#region Getters and Setters
	public get mesh() {
		return this.#mesh;
	}
	public set mesh(value) {
		this.#meshChanged = true;
		this.#mesh = value;
	}

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

	get position() {
		return new Maths.Vector3(this.#x, this.#y, this.#z);
	}

	get aabb() {
		return new Maths.Rectangle(this.#x, this.#y, this.#width, this.#height);
	}
	//#endregion

	#mesh: Graphics.Mesh;
	#model: Graphics.VertexBuffer | null;
	#effect: Graphics.Effect | null;

	#x: number;
	#y: number;
	#z: number;
	#width: number;
	#height: number;

	#translation: Maths.Vector3;
	#scale: Maths.Vector3;
	#rotationOffset: Maths.Vector3;
	#rotation: number;
	#color: Graphics.Color;

	#meshChanged: boolean;
	#transformChanged: boolean;

	constructor(
		mesh: Graphics.Mesh,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.#mesh = mesh;

		this.geometryData = null;
		this.#model = null;

		this.#x = x;
		this.#y = y;
		this.#z = 0;
		this.#width = width;
		this.#height = height;

		this.#translation = new Maths.Vector3(0, 0, 0);
		this.#scale = new Maths.Vector3(1, 1, 1);
		this.#rotationOffset = new Maths.Vector3(0, 0, 0);
		this.#rotation = 0;
		this.#color = new Graphics.Color(0xffffff);

		this.#meshChanged = false;
		this.#transformChanged = false;

		this.#effect = null;
	}

	public attachEffect(effect: Graphics.Effect) {
		this.#effect = effect;
	}

	public createGeometry(graphics: Graphics.GraphicsManager) {
		this.geometryData = new GeometryData(graphics, this.mesh);
	}

	public createModel(graphics: Graphics.GraphicsManager) {
		this.#meshChanged = false;
		// I hate this but for some reason Blink doesnt bode well with VertexUsage.DYNAMIC.
		// Refer to this issue for more info: https://github.com/thismarvin/susurrus/issues/5
		let modelLength = _attributeSchema.size;
		if (Utilities.BrowserDetection.IS_BLINK) {
			modelLength *= this.#mesh.totalVertices;
		}

		this.#model = new Graphics.VertexBuffer(
			graphics,
			_attributeSchema,
			modelLength,
			Graphics.VertexUsage.DYNAMIC,
			1
		);

		this.updateBuffer();
	}

	public calculateTransform() {
		const scale = Maths.Matrix4.createScale(
			this.width * this.scale.x,
			this.height * this.scale.y,
			this.scale.z
		);
		const preTranslation = Maths.Matrix4.createTranslation(
			-this.rotationOffset.x,
			-this.rotationOffset.y,
			0
		);
		const rotation = Maths.Matrix4.createRotationZ(this.rotation);
		const postTranslation = Maths.Matrix4.createTranslation(
			this.x + this.translation.x + this.rotationOffset.x,
			this.y + this.translation.y + this.rotationOffset.y,
			this.translation.z
		);

		const mul = Maths.Matrix4.multiply;

		return mul(mul(mul(scale, preTranslation), rotation), postTranslation);
	}

	public applyChanges() {
		if (this.#model === null) {
			throw new TypeError(
				"A model has not been created; cannot apply changes."
			);
		}

		this.#transformChanged = false;
		this.updateBuffer();
	}

	public draw(graphics: Graphics.GraphicsManager, camera: Camera) {
		if (
			this.geometryData === null ||
			this.#model === null ||
			this.#effect === null
		) {
			return;
		}

		if (this.#meshChanged) {
			throw new TypeError(
				"The polygon's mesh was modified, but a new model was not created. Make sure to call createModel(graphics)."
			);
		}

		if (this.#transformChanged) {
			throw new TypeError(
				"The polygon's transform was modified, but applyChanges() was never called."
			);
		}

		graphics.begin(this.#effect);

		graphics.setVertexBuffers([this.geometryData.vertexBuffer, this.#model]);
		graphics.setIndexBuffer(this.geometryData.indexBuffer);

		graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);

		graphics.drawElements(
			Graphics.DrawMode.TRIANGLES,
			this.geometryData.totalTriangles,
			0
		);

		graphics.end();
	}

	private updateBuffer() {
		if (this.#model === null) {
			return;
		}

		let bufferData: number[] = [];
		bufferData = bufferData.concat(
			new Maths.Vector3(
				this.#x + this.translation.x,
				this.#y + this.translation.y,
				this.#z + this.translation.z
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
