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
		if (data.length !== this.rows * this.columns) {
			throw new TypeError(
				"The given data does not match the dimensions of the matrix."
			);
		}

		this.#data = data.slice(0);
	}

	public set(x: number, y: number, value: number) {
		this.#data[this.columns * y + x] = value;
	}

	public transpose() {
		const temp = new Array(this.rows * this.columns).fill(0);
		const newRows = this.columns;
		const newColumns = this.rows;

		for (let y = 0; y < newRows; y++) {
			for (let x = 0; x < newColumns; x++) {
				temp[newColumns * y + x] = this.data[this.columns * x + y];
			}
		}

		this.#data = temp;
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

	//#region Static Methods
	public static add(a: Matrix, b: Matrix) {
		// Make sure we can even add the matrices.
		if (a.rows !== b.rows || a.columns !== b.columns) {
			throw new TypeError(
				"Both matrices are not the same size; cannot perform operation."
			);
		}

		const temp = a.data.slice(0);
		for (let i = 0; i < a.data.length; i++) {
			temp[i] += b.data[i];
		}

		return new Matrix(a.rows, a.columns, temp);
	}

	public static subtract(a: Matrix, b: Matrix) {
		// Make sure we can even add the matrices.
		if (a.rows !== b.rows || a.columns !== b.columns) {
			throw new TypeError(
				"Both matrices are not the same size; cannot perform operation."
			);
		}

		const temp = a.data.slice(0);
		for (let i = 0; i < a.rows * a.columns; i++) {
			temp[i] -= b.data[i];
		}

		return new Matrix(a.rows, b.rows, temp);
	}

	public static multiply(a: Matrix, b: Matrix) {
		// Make sure we can even multiply the matrices.
		if (a.columns !== b.rows) {
			throw new TypeError(
				`Matrix b must have ${a.columns} rows; cannot multiply matrices.`
			);
		}

		const result = new Matrix(a.rows, b.columns);

		for (let ay = 0; ay < a.rows; ay++) {
			for (let bx = 0; bx < b.columns; bx++) {
				let temp = 0;
				for (let ax = 0; ax < a.columns; ax++) {
					temp += a.get(ax, ay) * b.get(bx, ax);
				}
				result.set(bx, ay, temp);
			}
		}

		return result;
	}

	public static addScalar(a: Matrix, scalar: number) {
		const temp = a.data.slice(0);
		for (let i = 0; i < a.data.length; i++) {
			temp[i] += scalar;
		}

		return new Matrix(a.rows, a.columns, temp);
	}

	public static subtractScalar(a: Matrix, scalar: number) {
		const temp = a.data.slice(0);
		for (let i = 0; i < a.data.length; i++) {
			temp[i] -= scalar;
		}

		return new Matrix(a.rows, a.columns, temp);
	}

	public static multiplyScalar(a: Matrix, scalar: number) {
		const temp = a.data.slice(0);
		for (let i = 0; i < a.data.length; i++) {
			temp[i] *= scalar;
		}

		return new Matrix(a.rows, a.columns, temp);
	}

	public static divideScalar(a: Matrix, scalar: number) {
		const temp = 1 / scalar;

		return Matrix.multiplyScalar(a, temp);
	}
	//#endregion
}
