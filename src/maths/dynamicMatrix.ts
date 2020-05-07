import * as PropertyAssent from "../utilities/propertyAssent.js";

export default class DynamicMatrix {
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

	get(x: number, y: number) {
		return this.data[this.columns * y + x];
	}

	setData(data: number[]) {
		PropertyAssent.expectType(data, "array");

		if (data.length !== this.rows * this.columns) {
			throw new TypeError(
				"The data does not match the dimensions of the matrix."
			);
		}

		this.#data = data.slice(0);
	}

	set(x: number, y: number, value: number) {
		PropertyAssent.expectType(value, "number");

		this.#data[this.columns * y + x] = value;
	}

	transpose() {
		const transposed = new Array(this.rows * this.columns).fill(0);
		const newRows = this.columns;
		const newColumns = this.rows;

		for (let y = 0; y < newRows; y++) {
			for (let x = 0; x < newColumns; x++) {
				transposed[newColumns * y + x] = this.data[this.columns * x + y];
			}
		}

		this.#data = transposed;
		this.#rows = newRows;
		this.#columns = newColumns;
	}

	add(a: number | DynamicMatrix): DynamicMatrix {
		// First check if 'a' is just a number.
		if (
			PropertyAssent.expectType(a, "number", {
				throwError: false,
			})
		) {
			const aNumber = a as number;
			for (let i = 0; i < this.rows * this.columns; i++) {
				this.#data[i] += aNumber;
			}
			return this;
		}

		// Otherwise, 'a' must be a matrix.
		PropertyAssent.expectInstance(a, DynamicMatrix);

		const aMatrix = a as DynamicMatrix;

		// Make sure we can even add the matrices.
		if (this.rows !== aMatrix.rows || this.columns !== aMatrix.columns) {
			throw new TypeError(
				"Both matrices are not the same size; cannot perform operation."
			);
		}

		for (let i = 0; i < this.rows * this.columns; i++) {
			this.#data[i] += aMatrix.data[i];
		}

		return this;
	}

	subtract(a: number | DynamicMatrix): DynamicMatrix {
		// First check if 'a' is just a number.
		if (
			PropertyAssent.expectType(a, "number", {
				throwError: false,
			})
		) {
			const aNumber = a as number;
			for (let i = 0; i < this.rows * this.columns; i++) {
				this.#data[i] -= aNumber;
			}
			return this;
		}

		// Otherwise, 'a' must be a matrix.
		PropertyAssent.expectInstance(a, DynamicMatrix);

		const aMatrix = a as DynamicMatrix;

		// Make sure we can even subtract the matrices.
		if (this.rows !== aMatrix.rows || this.columns !== aMatrix.columns) {
			throw new TypeError(
				"Both matrices are not the same size; cannot perform operation."
			);
		}

		for (let i = 0; i < this.rows * this.columns; i++) {
			this.#data[i] -= aMatrix.data[i];
		}

		return this;
	}

	multiply(a: number | DynamicMatrix): DynamicMatrix {
		// First check if 'a' is just a number.
		if (
			PropertyAssent.expectType(a, "number", {
				throwError: false,
			})
		) {
			const aNumber = a as number;
			for (let i = 0; i < this.rows * this.columns; i++) {
				this.#data[i] *= aNumber;
			}
			return this;
		}

		// Otherwise, 'a' must be a matrix.
		PropertyAssent.expectInstance(a, DynamicMatrix);

		const aMatrix = a as DynamicMatrix;

		// Make sure we can even multiply the matrices.
		if (this.columns !== aMatrix.rows) {
			throw new TypeError(
				`The matrix provided must have ${this.columns} rows; cannot multiply matrices.`
			);
		}

		const result = new DynamicMatrix(this.rows, aMatrix.columns);

		for (let aY = 0; aY < this.rows; aY++) {
			for (let aX = 0; aX < this.columns; aX++) {
				for (let bX = 0; bX < aMatrix.columns; bX++) {
					result.set(
						bX,
						aY,
						result.get(bX, aY) + this.get(aX, aY) * aMatrix.get(bX, aX)
					);
				}
			}
		}

		this.#data = result.data;

		return this;
	}

	divide(a: number): DynamicMatrix {
		PropertyAssent.expectType(a, "number");

		const inverse = 1 / a;
		for (let i = 0; i < this.rows * this.columns; i++) {
			this.#data[i] *= inverse;
		}
		return this;
	}

	toString() {
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
}
