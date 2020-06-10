import Vector3 from "./vector3.js";

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

export function cross(a: Vector3, b: Vector3) {
	const x = a.y * b.z - b.y * a.z;
	const y = -(a.x * b.z - b.x * a.z);
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
