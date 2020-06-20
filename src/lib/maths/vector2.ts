import * as MathExt from "./mathExt.js";
// eslint-disable-next-line no-unused-vars
import Matrix4 from "./matrix4.js";

export default class Vector2 {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public length() {
		return Math.sqrt(this.lengthSquared());
	}

	public lengthSquared() {
		return this.x ** 2 + this.y ** 2;
	}

	public normalize() {
		const magnitude = this.length();
		const temp = 1 / magnitude;

		this.x *= temp;
		this.y *= temp;

		return this;
	}

	public copy(vector: Vector2) {
		this.x = vector.x;
		this.y = vector.y;
	}

	public clone() {
		return new Vector2(this.x, this.y);
	}

	public toArray() {
		return [this.x, this.y];
	}

	public toString() {
		return `(${this.x}, ${this.y})`;
	}

	//#region Static Methods
	public static distanceSquared(a: Vector2, b: Vector2) {
		const x = a.x - b.x;
		const y = a.y - b.y;

		return x ** 2 + y ** 2;
	}

	public static distance(a: Vector2, b: Vector2) {
		return Math.sqrt(Vector2.distanceSquared(a, b));
	}

	public static dot(a: Vector2, b: Vector2) {
		return a.x * b.x + a.y * b.y;
	}

	public static lerp(a: Vector2, b: Vector2, step: number) {
		const x = MathExt.lerp(a.x, b.x, step);
		const y = MathExt.lerp(a.y, b.y, step);

		return new Vector2(x, y);
	}

	public static lerpPrecise(a: Vector2, b: Vector2, step: number) {
		const x = MathExt.lerpPrecise(a.x, b.x, step);
		const y = MathExt.lerpPrecise(a.y, b.y, step);

		return new Vector2(x, y);
	}

	public static polarToCartesian(radius: number, theta: number) {
		return new Vector2(radius * Math.cos(theta), radius * Math.sin(theta));
	}

	public static fromAngle(theta: number) {
		return Vector2.polarToCartesian(1, theta);
	}

	public static random() {
		return Vector2.fromAngle(Math.random() * Math.PI * 2);
	}

	public static add(a: Vector2, b: Vector2) {
		const x = a.x + b.x;
		const y = a.y + b.y;

		return new Vector2(x, y);
	}

	public static subtract(a: Vector2, b: Vector2) {
		const x = a.x - b.x;
		const y = a.y - b.y;

		return new Vector2(x, y);
	}

	public static multiply(a: Vector2, b: Vector2) {
		const x = a.x * b.x;
		const y = a.y * b.y;

		return new Vector2(x, y);
	}

	public static divide(a: Vector2, b: Vector2) {
		const x = a.x / b.x;
		const y = a.y / b.y;

		return new Vector2(x, y);
	}

	public static addScalar(a: Vector2, scalar: number) {
		const x = a.x + scalar;
		const y = a.y + scalar;

		return new Vector2(x, y);
	}

	public static subtractScalar(a: Vector2, scalar: number) {
		const x = a.x - scalar;
		const y = a.y - scalar;

		return new Vector2(x, y);
	}

	public static multiplyScalar(a: Vector2, scalar: number) {
		const x = a.x * scalar;
		const y = a.y * scalar;

		return new Vector2(x, y);
	}

	public static divideScalar(a: Vector2, scalar: number) {
		const x = a.x / scalar;
		const y = a.y / scalar;

		return new Vector2(x, y);
	}

	public static transform(a: Vector2, b: Matrix4) {
		const x = a.x * b.data[0] + a.y * b.data[4] + b.data[12];
		const y = a.x * b.data[1] + a.y * b.data[5] + b.data[13];

		return new Vector2(x, y);
	}
	//#endregion
}
