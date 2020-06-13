function* spareSetIterator(data: number[]) {
	for (let i = 0; i < data.length; i++) {
		yield data[i];
	}
}

/**
 * A data structure that stores a set of positive numbers that all fall within a given range.
 */
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

	/**
	 * Creates a data structure that stores a set of positive numbers that all fall within a given range.
	 * @param range The maximum amount of elements allowed inside the sparse set AND the maximum value allowed inside the set.
	 */
	constructor(range: number) {
		if (range < 0) {
			throw new TypeError("The range must be greater than or equal to zero.");
		}

		this.#u = range;
		this.#n = 0;
		this.#sparse = new Array(this.#u).fill(0);
		this.#dense = new Array(this.#u).fill(0);
	}

	/**
	 * Returns whether or not a given number is in the set.
	 * @param value The element to find in the set.
	 */
	public has(value: number) {
		if (value < 0) {
			throw new TypeError("The 'value' parameter must be a positive number.");
		}

		return (
			value < this.#u &&
			this.#sparse[value] < this.#n &&
			this.#dense[this.#sparse[value]] === value
		);
	}

	/**
	 * Adds a given positive number to the set.
	 * @param value The element to find in the set.
	 */
	public add(value: number) {
		if (value >= this.#u) {
			throw new TypeError(
				"The 'value' parameter cannot be greater than or equal to the SparseSet's range."
			);
		}

		if (this.has(value)) {
			return false;
		}

		this.#dense[this.#n] = value;
		this.#sparse[value] = this.#n;
		this.#n++;

		return true;
	}

	/**
	 * Removes a given positive number from the set.
	 * @param value The element to remove from the set.
	 */
	public delete(value: number) {
		if (!this.has(value)) {
			return false;
		}

		this.#n--;

		for (let i = this.#dense.indexOf(value); i < this.#n; i++) {
			this.#dense[i] = this.#dense[i + 1];
			this.#sparse[this.#dense[i + 1]] = i;
		}

		return true;
	}

	/**
	 * Removes all elements from the set.
	 */
	public clear() {
		this.#n = 0;
	}

	// Support for iteration through a for-of loop.
	public *[Symbol.iterator]() {
		for (let i = 0; i < this.#n; i++) {
			yield this.#dense[i];
		}
	}
}
