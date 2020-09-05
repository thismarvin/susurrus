import * as Graphics from "../../lib/graphics.js";
import * as Maths from "../../lib/maths.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometryData.js";

export default class Polygon {
	//#region Getters and Setters
	get position() {
		return this.#position;
	}
	set position(value) {
		this.setPosition(value.x, value.y, value.z);
	}

	get x() {
		return this.#position.x;
	}
	set x(value) {
		this.setPosition(value, this.#position.y, this.#position.z);
	}
	get y() {
		return this.#position.y;
	}
	set y(value) {
		this.setPosition(this.#position.x, value, this.#position.z);
	}
	get z() {
		return this.#position.z;
	}
	set z(value) {
		this.setPosition(this.#position.x, this.#position.y, value);
	}

	get width() {
		return this.#width;
	}
	set width(value) {
		this.setDimensions(value, this.#height);
	}

	get height() {
		return this.#height;
	}
	set height(value) {
		this.setDimensions(this.#width, value);
	}

	get scale() {
		return this.#scale;
	}
	set scale(value) {
		this.setScale(value.x, value.y, value.z);
	}

	get translation() {
		return this.#translation;
	}
	set translation(value) {
		this.setTranslation(value.x, value.y, value.z);
	}

	get origin() {
		return this.#origin;
	}
	set origin(value) {
		this.setOrigin(value.x, value.y, value.z);
	}

	get rotation() {
		return this.#rotation;
	}
	set rotation(value) {
		this.setRotation(value.x, value.y, value.z);
	}

	get color() {
		return this.#color;
	}
	set color(value) {
		this.setColor(value);
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

	public attachGeometry(geometry: GeometryData) {
		this.#geometryData = geometry;

		return this;
	}

	public setPosition(x: number, y: number, z: number) {
		this.#position.x = x;
		this.#position.y = y;
		this.#position.z = z;

		this.#transformChanged = true;

		return this;
	}

	public setDimensions(width: number, height: number) {
		this.#width = width;
		this.#height = height;

		this.#transformChanged = true;

		return this;
	}

	public setColor(color: Graphics.Color) {
		this.#color = color;

		return this;
	}

	public setScale(x: number, y: number, z: number) {
		this.#scale.x = x;
		this.#scale.y = y;
		this.#scale.z = z;

		this.#transformChanged = true;

		return this;
	}

	public setTranslation(x: number, y: number, z: number) {
		this.#translation.x = x;
		this.#translation.y = y;
		this.#translation.z = z;

		this.#transformChanged = true;

		return this;
	}

	public setOrigin(x: number, y: number, z: number) {
		this.#origin.x = x;
		this.#origin.y = y;
		this.#origin.z = z;

		this.#transformChanged = true;

		return this;
	}

	public setRotation(roll: number, pitch: number, yaw: number) {
		this.#rotation.x = roll;
		this.#rotation.y = pitch;
		this.#rotation.z = yaw;

		this.#transformChanged = true;

		return this;
	}

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
}
