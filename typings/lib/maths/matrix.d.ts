export default class Matrix {
	#private;
	get rows(): number;
	get columns(): number;
	get data(): number[];
	constructor(rows: number, columns: number, data?: number[]);
	get(x: number, y: number): number;
	setData(data: number[]): void;
	set(x: number, y: number, value: number): void;
	transpose(): void;
	toString(): string;
	static add(a: Matrix, b: Matrix): Matrix;
	static subtract(a: Matrix, b: Matrix): Matrix;
	static multiply(a: Matrix, b: Matrix): Matrix;
	static addScalar(a: Matrix, scalar: number): Matrix;
	static subtractScalar(a: Matrix, scalar: number): Matrix;
	static multiplyScalar(a: Matrix, scalar: number): Matrix;
	static divideScalar(a: Matrix, scalar: number): Matrix;
}
//# sourceMappingURL=matrix.d.ts.map
