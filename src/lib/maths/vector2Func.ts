import Vector2 from "./vector2.js";

export function lengthSquared(a: Vector2) {
	return a.x ** 2 + a.y ** 2;
}

export function length(a: Vector2) {
	return Math.sqrt(lengthSquared(a));
}

export function distanceSquared(a: Vector2, b: Vector2) {
	const x = a.x - b.x;
	const y = a.y - b.y;

	return x ** 2 + y ** 2;
}

export function distance(a: Vector2, b: Vector2) {
	return Math.sqrt(distanceSquared(a, b));
}

export function dot(a: Vector2, b: Vector2) {
	return a.x * b.x + a.y * b.y;
}

export function normalize(a: Vector2) {
	const magnitude = length(a);
	const temp = 1 / magnitude;

	return multiplyScalar(a, temp);
}

export function add(a: Vector2, b: Vector2) {
	const x = a.x + b.x;
	const y = a.y + b.y;

	return new Vector2(x, y);
}

export function subtract(a: Vector2, b: Vector2) {
	const x = a.x - b.x;
	const y = a.y - b.y;

	return new Vector2(x, y);
}

export function multiply(a: Vector2, b: Vector2) {
	const x = a.x * b.x;
	const y = a.y * b.y;

	return new Vector2(x, y);
}

export function divide(a: Vector2, b: Vector2) {
	const x = a.x / b.x;
	const y = a.y / b.y;

	return new Vector2(x, y);
}

export function addScalar(a: Vector2, scalar: number) {
	const x = a.x + scalar;
	const y = a.y + scalar;

	return new Vector2(x, y);
}

export function subtractScalar(a: Vector2, scalar: number) {
	const x = a.x - scalar;
	const y = a.y - scalar;

	return new Vector2(x, y);
}

export function multiplyScalar(a: Vector2, scalar: number) {
	const x = a.x * scalar;
	const y = a.y * scalar;

	return new Vector2(x, y);
}

export function divideScalar(a: Vector2, scalar: number) {
	const x = a.x / scalar;
	const y = a.y / scalar;

	return new Vector2(x, y);
}
