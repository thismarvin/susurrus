function* spareSetIterator(data: number[]) {
	for (let i = 0; i < data.length; i++) {
		yield data[i];
	}
}

export default class SparseSet {
	public get size() {
		return this.#n;
	}

	public get values() {
		return spareSetIterator(this.#dense.slice(0, this.#n));
	}

	#dense: number[];
	#sparse: number[];
	#u: number;
	#n: number;

	constructor(range: number) {
		this.#u = range;
		this.#n = 0;
		this.#sparse = new Array(this.#u).fill(0);
		this.#dense = new Array(this.#u).fill(0);
	}

	public has(k: number) {
		return (
			k < this.#u &&
			this.#sparse[k] < this.#n &&
			this.#dense[this.#sparse[k]] === k
		);
	}

	public add(k: number) {
		if (k < 0 || k >= this.#u) {
			throw new TypeError(
				"Index was outside the bounds of the array. A SparseSet cannot contain a value less than 0 or greater than its range."
			);
		}

		if (this.has(k)) {
			return false;
		}

		this.#dense[this.#n] = k;
		this.#sparse[k] = this.#n;
		this.#n++;

		return true;
	}

	public delete(k: number) {
		if (!this.has(k)) {
			return false;
		}

		this.#n--;

		for (let i = this.#dense.indexOf(k); i < this.#n; i++) {
			this.#dense[i] = this.#dense[i + 1];
			this.#sparse[this.#dense[i + 1]] = i;
		}

		return true;
	}

	public clear() {
		this.#n = 0;
	}

	public *[Symbol.iterator]() {
		for (let i = 0; i < this.#n; i++) {
			yield this.#dense[i];
		}
	}
}
