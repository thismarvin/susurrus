import * as PropertyAssent from "../utilities/propertyAssent.js";

export default class Matrix {
	get rows(): number {
		return this.#rows;
	}
	get columns(): number {
		return this.#columns;
	}
	get data(): number[] {
		return this.#data;
	}

	#rows: number;
	#columns: number;
	#data: number[];

	constructor(rows: number, columns: number, data?: number[]) {
		this.#rows = rows;
		this.#columns = columns;
		this.#data = new Array(this.#rows * this.#columns).fill(0);

		if (data !== undefined) {
			this.setData(data);
		}
	}

	public get(x: number, y: number) {
		return this.data[this.columns * y + x];
	}

	public setData(data: number[]) {
		PropertyAssent.expectType(data, "array");

		if (data.length !== this.rows * this.columns) {
			throw new TypeError(
				"The given data does not match the dimensions of the matrix."
			);
		}

		this.#data = data.slice(0);
	}

	public set(x: number, y: number, value: number) {
		PropertyAssent.expectType(value, "number");

		this.#data[this.columns * y + x] = value;
	}

	public toString() {
		let string = "";

		for (let i = 0; i < this.#data.length; i += this.columns) {
			string += `( ${this.#data[i]}`;
			for (let j = 1; j < this.columns; j++) {
				string += ` ${this.#data[i + j]}`;
			}

			string += " )";

			if (i !== this.#data.length - this.columns) {
				string += " ";
			}
		}

		return string;
	}

	//#region Static Functions
	public static add(a: Matrix, b: Matrix) {
		PropertyAssent.expectInstance(a, Matrix);
		PropertyAssent.expectInstance(b, Matrix);

		// Make sure we can even add the matrices.
		if (a.rows !== b.rows || a.columns !== b.columns) {
			throw new TypeError(
				"Both matrices are not the same size; cannot perform operation."
			);
		}

		const data = a.data.slice(0);
		for (let i = 0; i < a.rows * a.columns; i++) {
			data[i] += b.data[i];
		}

		return new Matrix(a.rows, b.rows, data);
	}

	public static addScalar(a: Matrix, scalar: number) {
		PropertyAssent.expectInstance(a, Matrix);
		PropertyAssent.expectType(scalar, "number");

		const data = a.data.slice(0);
		for (let i = 0; i < a.rows * a.columns; i++) {
			data[i] += scalar;
		}

		return new Matrix(a.rows, a.columns, data);
	}

	public static sub(a: Matrix, b: Matrix) {
		PropertyAssent.expectInstance(a, Matrix);
		PropertyAssent.expectInstance(b, Matrix);

		// Make sure we can even add the matrices.
		if (a.rows !== b.rows || a.columns !== b.columns) {
			throw new TypeError(
				"Both matrices are not the same size; cannot perform operation."
			);
		}

		const data = a.data.slice(0);
		for (let i = 0; i < a.rows * a.columns; i++) {
			data[i] -= b.data[i];
		}

		return new Matrix(a.rows, b.rows, data);
	}

	public static subScalar(a: Matrix, scalar: number) {
		PropertyAssent.expectInstance(a, Matrix);
		PropertyAssent.expectType(scalar, "number");

		const data = a.data.slice(0);
		for (let i = 0; i < a.rows * a.columns; i++) {
			data[i] -= scalar;
		}

		return new Matrix(a.rows, a.columns, data);
	}

	public static mult(a: Matrix, b: Matrix) {
		PropertyAssent.expectInstance(a, Matrix);
		PropertyAssent.expectInstance(b, Matrix);

		// Make sure we can even multiply the matrices.
		if (a.columns !== b.rows) {
			throw new TypeError(
				`Matrix b must have ${a.columns} rows; cannot multiply matrices.`
			);
		}

		const result = new Matrix(a.rows, b.columns);

		for (let aY = 0; aY < a.rows; aY++) {
			for (let aX = 0; aX < a.columns; aX++) {
				for (let bX = 0; bX < b.columns; bX++) {
					result.set(
						bX,
						aY,
						result.get(bX, aY) + a.get(aX, aY) * b.get(bX, aX)
					);
				}
			}
		}

		return result;
	}

	public static multScalar(a: Matrix, scalar: number) {
		PropertyAssent.expectInstance(a, Matrix);
		PropertyAssent.expectType(scalar, "number");

		const data = a.data.slice(0);
		for (let i = 0; i < a.rows * a.columns; i++) {
			data[i] *= scalar;
		}

		return new Matrix(a.rows, a.columns, data);
	}

	public static divideScalar(a: Matrix, scalar: number) {
		PropertyAssent.expectInstance(a, Matrix);
		PropertyAssent.expectType(scalar, "number");

		const data = a.data.slice(0);
		for (let i = 0; i < a.rows * a.columns; i++) {
			data[i] /= scalar;
		}

		return new Matrix(a.rows, a.columns, data);
	}

	public static transpose(a: Matrix) {
		PropertyAssent.expectInstance(a, Matrix);

		const transposed = new Array(a.rows * a.columns).fill(0);
		const newRows = a.columns;
		const newColumns = a.rows;

		for (let y = 0; y < newRows; y++) {
			for (let x = 0; x < newColumns; x++) {
				transposed[newColumns * y + x] = a.data[a.columns * x + y];
			}
		}

		return new Matrix(newRows, newColumns, transposed);
	}
	//#endregion
}
