export default class Vector3 {
	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number);
	multiply(value: number): void;
	divide(value: number): void;
	length(): number;
	normalize(): void;
	toArray(): number[];
	static dot(a: Vector3, b: Vector3): number;
	static cross(a: Vector3, b: Vector3): Vector3;
	static subtract(a: Vector3, b: Vector3): Vector3;
}
