import * as Matrix4Func from "./matrix4Func.js";

export default class Matrix4 {
	public get rows() {
		return this.#rows;
	}
	public get columns() {
		return this.#columns;
	}
	public get data() {
		return this.#data;
	}

	#rows: number;
	#columns: number;
	#data: number[];

	constructor(data?: number[]) {
		this.#rows = 4;
		this.#columns = 4;
		this.#data = new Array(this.#rows * this.#columns).fill(0);

		if (data !== undefined) {
			this.setData(data);
		}
	}

	public setData(data: number[]) {
		if (data.length !== this.#rows * this.#columns) {
			throw new TypeError(
				"The given data does not match the dimensions of the matrix."
			);
		}

		this.#data = data.slice(0);
	}

	public get(x: number, y: number) {
		return this.#data[this.#columns * y + x];
	}

	public set(x: number, y: number, value: number) {
		this.#data[this.#columns * y + x] = value;
	}

	public transpose() {
		this.setData(Matrix4Func.transpose(this).data);
	}
}
