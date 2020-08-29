import * as Graphics from "../../../lib/graphics.js";
import * as Maths from "../../../lib/maths.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometryData.js";

//const _attributeSchema = new Graphics.AttributeSchema([
//new Graphics.AttributeElement("a_scale", 3, Graphics.AttributeType.FLOAT),
//new Graphics.AttributeElement(
//"a_translation",
//3,
//Graphics.AttributeType.FLOAT
//),
//new Graphics.AttributeElement(
//"a_origin",
//3,
//Graphics.AttributeType.FLOAT
//),
//new Graphics.AttributeElement("a_origin", 3, Graphics.AttributeType.FLOAT),
//new Graphics.AttributeElement("a_color", 4, Graphics.AttributeType.FLOAT),
//]);

export default abstract class Polygon {
	//#region Getters and Setters
	get position() {
		return this.#position;
	}
	set position(value) {
		if (value == this.#position) {
			return;
		}

		this.#position = value;
	}

	get x() {
		return this.#position.x;
	}
	set x(value) {
		if (value === this.#position.x) {
			return;
		}

		this.#position.x = value;
	}
	get y() {
		return this.#position.y;
	}
	set y(value) {
		if (value === this.#position.y) {
			return;
		}

		this.#position.y = value;
	}
	get z() {
		return this.#position.z;
	}
	set z(value) {
		if (value === this.#position.z) {
			return;
		}

		this.#position.z = value;
	}

	get width() {
		return this.#width;
	}
	set width(value) {
		if (value === this.#width) {
			return;
		}

		this.#width = value;
	}

	get height() {
		return this.#height;
	}
	set height(value) {
		if (value === this.#height) {
			return;
		}

		this.#height = value;
	}

	get scale() {
		return this.#scale;
	}
	set scale(value) {
		if (value === this.#scale) {
			return;
		}

		this.#scale = value;
	}

	get translation() {
		return this.#translation;
	}
	set translation(value) {
		if (value === this.#translation) {
			return;
		}

		this.#translation = value;
	}

	get origin() {
		return this.#origin;
	}
	set origin(value) {
		if (value === this.#origin) {
			return;
		}

		this.#origin = value;
	}

	get rotation() {
		return this.#rotation;
	}
	set rotation(value) {
		if (value === this.#rotation) {
			return;
		}

		this.#rotation = value;
	}

	get color() {
		return this.#color;
	}
	set color(value) {
		if (value === this.#color) {
			return;
		}

		this.#color = value;
	}

	get geometryData() {
		return this.#geometryData;
	}
	set geometryData(value) {
		if (value != null) {
			this.attachGeometry(value);
		}
	}

	get aabb() {
		return new Maths.Rectangle(
			this.#position.x,
			this.#position.y,
			this.#width,
			this.#height
		);
	}
	//#endregion

	#position: Maths.Vector3;
	#width: number;
	#height: number;

	#scale: Maths.Vector3;
	#translation: Maths.Vector3;
	#origin: Maths.Vector3;
	#rotation: Maths.Vector3;
	#color: Graphics.Color;
	#geometryData: GeometryData | null;

	#transformChanged: boolean;
	#transformCache: Maths.Matrix4;

	constructor() {
		this.#position = new Maths.Vector3(0, 0, 0);
		this.#width = 0;
		this.#height = 0;

		this.#translation = new Maths.Vector3(0, 0, 0);
		this.#scale = new Maths.Vector3(1, 1, 1);
		this.#origin = new Maths.Vector3(0, 0, 0);
		this.#rotation = new Maths.Vector3(0, 0, 0);
		this.#color = new Graphics.Color(0xffffff);
		this.#geometryData = null;

		this.#transformChanged = true;
		this.#transformCache = new Maths.Matrix4();
	}

	public setPosition(x: number, y: number, z: number) {
		this.#position.x = x;
		this.#position.y = y;
		this.#position.z = z;

		this.#transformChanged = true;

		return this;
	}

	public attachGeometry(geometry: GeometryData) {
		this.#geometryData = geometry;

		return this;
	}

	/**
	 * Creates a buffer that handles model specific transformations and properties.
	 * @param graphics The current theater's GraphicsManager.
	 */
	//public createModelBuffer(graphics: Graphics.GraphicsManager) {
	//this.#meshChanged = false;
	//// I hate this but for some reason Blink doesnt bode well with VertexUsage.DYNAMIC.
	//// Refer to this issue for more info: https://github.com/thismarvin/susurrus/issues/5
	//let modelLength = _attributeSchema.size;
	//if (Utilities.BrowserDetection.IS_BLINK) {
	//modelLength *= this.#mesh.totalVertices;
	//}

	//this.#modelBuffer = new Graphics.VertexBuffer(
	//graphics,
	//_attributeSchema,
	//modelLength,
	//Graphics.VertexUsage.DYNAMIC,
	//1
	//);

	//this.updateModelBuffer();

	//return this;
	//}

	/**
	 * Creates and returns a 4x4 matrix that represents all of the polygon's transformations.
	 */
	public calculateTransform() {
		if (this.#transformChanged) {
			const scale = Maths.Matrix4.createScale(
				this.#width * this.#scale.x,
				this.#height * this.#scale.y,
				this.#scale.z
			);
			const preTranslation = Maths.Matrix4.createTranslation(
				-this.#origin.x,
				-this.#origin.y,
				-this.#origin.z
			);
			const rotationZ = Maths.Matrix4.createRotationZ(this.#rotation.z);
			const rotationY = Maths.Matrix4.createRotationY(this.#rotation.y);
			const rotationX = Maths.Matrix4.createRotationX(this.#rotation.x);
			const postTranslation = Maths.Matrix4.createTranslation(
				this.#position.x + this.#translation.x + this.#origin.x,
				this.#position.y + this.#translation.y + this.#origin.y,
				this.#position.z + this.#translation.z + this.#origin.z
			);

			const mul = Maths.Matrix4.multiply;

			this.#transformCache = mul(
				mul(
					mul(mul(mul(scale, preTranslation), rotationZ), rotationY),
					rotationX
				),
				postTranslation
			);
		}

		return this.#transformCache;
	}

	//public draw(graphics: Graphics.GraphicsManager, camera: Camera) {
	//graphics
	//.begin(this.#effect)
	//.setVertexBuffer(this.#geometryData.vertexBuffer, this.#modelBuffer)
	//.setIndexBuffer(this.#geometryData.indexBuffer)
	//.setUniform("worldViewProjection", camera.wvp.data)
	//.drawElements(
	//Graphics.DrawMode.TRIANGLES,
	//this.#geometryData.totalTriangles,
	//0
	//)
	//.end();
	//}

	//private updateModelBuffer() {
	//if (this.#modelBuffer === null) {
	//return;
	//}

	//let bufferData: number[] = [];
	//bufferData = bufferData.concat(
	//new Maths.Vector3(
	//this.#x + this.translation.x,
	//this.#y + this.translation.y,
	//this.#z + this.translation.z
	//).toArray()
	//);
	//bufferData = bufferData.concat(
	//new Maths.Vector3(
	//this.#width * this.#scale.x,
	//this.#height * this.#scale.y,
	//this.#scale.z
	//).toArray()
	//);
	//bufferData = bufferData.concat(this.#rotationOffset.toArray());
	//bufferData = bufferData.concat(this.#rotation);
	//bufferData = bufferData.concat(this.#color.toArray());

	//this.#modelBuffer.setData(bufferData);
	//}
}
