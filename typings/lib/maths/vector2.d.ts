import Matrix4 from "./matrix4.js";
export default class Vector2 {
	x: number;
	y: number;
	static get ZERO(): Vector2;
	static get ONE(): Vector2;
	static get UNIT_X(): Vector2;
	static get UNIT_Y(): Vector2;
	constructor(x: number, y: number);
	length(): number;
	lengthSquared(): number;
	normalize(): this;
	copy(vector: Vector2): void;
	clone(): Vector2;
	toArray(): number[];
	toString(): string;
	static distanceSquared(a: Vector2, b: Vector2): number;
	static distance(a: Vector2, b: Vector2): number;
	static dot(a: Vector2, b: Vector2): number;
	static lerp(a: Vector2, b: Vector2, step: number): Vector2;
	static lerpPrecise(a: Vector2, b: Vector2, step: number): Vector2;
	static polarToCartesian(radius: number, theta: number): Vector2;
	static fromAngle(theta: number): Vector2;
	static random(): Vector2;
	static add(a: Vector2, b: Vector2): Vector2;
	static subtract(a: Vector2, b: Vector2): Vector2;
	static multiply(a: Vector2, b: Vector2): Vector2;
	static divide(a: Vector2, b: Vector2): Vector2;
	static addScalar(a: Vector2, scalar: number): Vector2;
	static subtractScalar(a: Vector2, scalar: number): Vector2;
	static multiplyScalar(a: Vector2, scalar: number): Vector2;
	static divideScalar(a: Vector2, scalar: number): Vector2;
	static transform(a: Vector2, b: Matrix4): Vector2;
}
//# sourceMappingURL=vector2.d.ts.map
