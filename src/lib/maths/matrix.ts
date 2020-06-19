import * as MatrixFunc from "./matrixExt.js";

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
		this.setData(MatrixFunc.transpose(this).data);
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
}
