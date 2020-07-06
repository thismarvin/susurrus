import Vector3 from "./vector3.js";
export default class Matrix4 {
	#private;
	get rows(): number;
	get columns(): number;
	get data(): number[];
	static get IDENTITY(): Matrix4;
	constructor(data?: number[]);
	setData(data: number[]): void;
	get(x: number, y: number): number;
	set(x: number, y: number, value: number): void;
	transpose(): void;
	toString(): string;
	static add(a: Matrix4, b: Matrix4): Matrix4;
	static subtract(a: Matrix4, b: Matrix4): Matrix4;
	static multiply(a: Matrix4, b: Matrix4): Matrix4;
	static addScalar(a: Matrix4, scalar: number): Matrix4;
	static subtractScalar(a: Matrix4, scalar: number): Matrix4;
	static multiplyScalar(a: Matrix4, scalar: number): Matrix4;
	static divideScalar(a: Matrix4, scalar: number): Matrix4;
	static createRotationX(angle: number): Matrix4;
	static createRotationY(angle: number): Matrix4;
	static createRotationZ(angle: number): Matrix4;
	static createTranslation(x: number, y: number, z: number): Matrix4;
	static createScale(x: number, y: number, z: number): Matrix4;
	static createOrthographic(
		width: number,
		height: number,
		near: number,
		far: number
	): Matrix4;
	static createOrthographicOffCenter(
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number,
		far: number
	): Matrix4;
	static createPerspective(
		width: number,
		height: number,
		near: number,
		far: number
	): Matrix4;
	static createPerspectiveOffCenter(
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number,
		far: number
	): Matrix4;
	static createLookAt(
		cameraPosition: Vector3,
		cameraTarget: Vector3,
		cameraUp: Vector3
	): Matrix4;
}
//# sourceMappingURL=matrix4.d.ts.map
