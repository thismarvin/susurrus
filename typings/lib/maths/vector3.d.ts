import Matrix4 from "./matrix4.js";
export default class Vector3 {
	x: number;
	y: number;
	z: number;
	static get ZERO(): Vector3;
	static get ONE(): Vector3;
	static get UNIT_X(): Vector3;
	static get UNIT_Y(): Vector3;
	static get UNIT_Z(): Vector3;
	static get LEFT(): Vector3;
	static get UP(): Vector3;
	static get RIGHT(): Vector3;
	static get DOWN(): Vector3;
	static get FORWARD(): Vector3;
	static get BACKWARD(): Vector3;
	constructor(x: number, y: number, z: number);
	length(): number;
	lengthSquared(): number;
	normalize(): this;
	copy(vector: Vector3): void;
	clone(): Vector3;
	toArray(): number[];
	toString(): string;
	static distanceSquared(a: Vector3, b: Vector3): number;
	static distance(a: Vector3, b: Vector3): number;
	static dot(a: Vector3, b: Vector3): number;
	static lerp(a: Vector3, b: Vector3, step: number): Vector3;
	static lerpPrecise(a: Vector3, b: Vector3, step: number): Vector3;
	/**
	 * Converts spherical coordinates into Cartesian coordinates (represented as a Vector3).
	 * @param radius The distance between the origin and the new point.
	 * @param inclination The angle between the point and y axis (latitude).
	 * @param azimuth The angle between the point and z axis (longitude).
	 */
	static sphericalToCartesian(
		radius: number,
		inclination: number,
		azimuth: number
	): Vector3;
	static cross(a: Vector3, b: Vector3): Vector3;
	static add(a: Vector3, b: Vector3): Vector3;
	static subtract(a: Vector3, b: Vector3): Vector3;
	static multiply(a: Vector3, b: Vector3): Vector3;
	static divide(a: Vector3, b: Vector3): Vector3;
	static addScalar(a: Vector3, scalar: number): Vector3;
	static subtractScalar(a: Vector3, scalar: number): Vector3;
	static multiplyScalar(a: Vector3, scalar: number): Vector3;
	static divideScalar(a: Vector3, scalar: number): Vector3;
	static transform(a: Vector3, b: Matrix4): Vector3;
}
//# sourceMappingURL=vector3.d.ts.map
