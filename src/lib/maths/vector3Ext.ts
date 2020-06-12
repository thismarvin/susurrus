import Vector3 from "./vector3.js";
import * as MathFunc from "./mathExt.js";

export function lengthSquared(a: Vector3) {
	return a.x ** 2 + a.y ** 2 + a.z ** 2;
}

export function length(a: Vector3) {
	return Math.sqrt(lengthSquared(a));
}

export function distanceSquared(a: Vector3, b: Vector3) {
	const x = a.x - b.x;
	const y = a.y - b.y;
	const z = a.z - b.z;

	return x ** 2 + y ** 2 + z ** 2;
}

export function distance(a: Vector3, b: Vector3) {
	return Math.sqrt(distanceSquared(a, b));
}

export function dot(a: Vector3, b: Vector3) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function normalize(a: Vector3) {
	const magnitude = length(a);
	const temp = 1 / magnitude;

	return multiplyScalar(a, temp);
}

export function lerp(a: Vector3, b: Vector3, step: number) {
	const x = MathFunc.lerp(a.x, b.x, step);
	const y = MathFunc.lerp(a.y, b.y, step);
	const z = MathFunc.lerp(a.z, b.z, step);

	return new Vector3(x, y, z);
}

export function lerpPrecise(a: Vector3, b: Vector3, step: number) {
	const x = MathFunc.lerpPrecise(a.x, b.x, step);
	const y = MathFunc.lerpPrecise(a.y, b.y, step);
	const z = MathFunc.lerpPrecise(a.z, b.z, step);

	return new Vector3(x, y, z);
}

/**
 * Converts spherical coordinates into Cartesian coordinates (represented as a Vector3).
 * @param radius The distance between the origin and the new point.
 * @param inclination The angle between the x and y axis (longitude).
 * @param azimuth The angle between the x and z axis (latitude).
 */
export function sphericalToCartesian(
	radius: number,
	inclination: number,
	azimuth: number
) {
	return new Vector3(
		radius * Math.sin(inclination) * Math.cos(azimuth),
		radius * Math.sin(inclination) * Math.sin(azimuth),
		radius * Math.cos(inclination)
	);
}

export function cross(a: Vector3, b: Vector3) {
	const x = a.y * b.z - b.y * a.z;
	const y = a.z * b.x - b.z * a.x;
	const z = a.x * b.y - b.x * a.y;

	return new Vector3(x, y, z);
}

export function add(a: Vector3, b: Vector3) {
	const x = a.x + b.x;
	const y = a.y + b.y;
	const z = a.z + b.z;

	return new Vector3(x, y, z);
}

export function subtract(a: Vector3, b: Vector3) {
	const x = a.x - b.x;
	const y = a.y - b.y;
	const z = a.z - b.z;

	return new Vector3(x, y, z);
}

export function multiply(a: Vector3, b: Vector3) {
	const x = a.x * b.x;
	const y = a.y * b.y;
	const z = a.z * b.z;

	return new Vector3(x, y, z);
}

export function divide(a: Vector3, b: Vector3) {
	const x = a.x / b.x;
	const y = a.y / b.y;
	const z = a.z / b.z;

	return new Vector3(x, y, z);
}

export function addScalar(a: Vector3, scalar: number) {
	const x = a.x + scalar;
	const y = a.y + scalar;
	const z = a.z + scalar;

	return new Vector3(x, y, z);
}

export function subtractScalar(a: Vector3, scalar: number) {
	const x = a.x - scalar;
	const y = a.y - scalar;
	const z = a.z - scalar;

	return new Vector3(x, y, z);
}

export function multiplyScalar(a: Vector3, scalar: number) {
	const x = a.x * scalar;
	const y = a.y * scalar;
	const z = a.z * scalar;

	return new Vector3(x, y, z);
}

export function divideScalar(a: Vector3, scalar: number) {
	const x = a.x / scalar;
	const y = a.y / scalar;
	const z = a.z / scalar;

	return new Vector3(x, y, z);
}
