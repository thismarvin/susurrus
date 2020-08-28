/**
 * A data structure that stores a set of positive numbers that all fall within a given range.
 */
export default class SparseSet {
	#private;
	get size(): number;
	get values(): Generator<number, void, unknown>;
	/**
	 * Creates a data structure that stores a set of positive numbers that all fall within a given range.
	 * @param range The maximum amount of elements allowed inside the sparse set AND the maximum value allowed inside the set.
	 */
	constructor(range: number);
	/**
	 * Returns whether or not a given number is in the set.
	 * @param value The element to find in the set.
	 */
	has(value: number): boolean;
	/**
	 * Adds a given positive number to the set.
	 * @param value The element to find in the set.
	 */
	add(value: number): boolean;
	/**
	 * Removes a given positive number from the set.
	 * @param value The element to remove from the set.
	 */
	delete(value: number): boolean;
	/**
	 * Removes all elements from the set.
	 */
	clear(): void;
	[Symbol.iterator](): Generator<number, void, unknown>;
}
//# sourceMappingURL=sparseSet.d.ts.map
