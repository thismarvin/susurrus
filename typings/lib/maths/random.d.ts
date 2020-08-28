/**
 * A pseudorandom number generator.
 */
export default class Random {
	#private;
	/**
	 * Creates a pseudorandom number generator.
	 * @param seed An optional integer that can be used to seed the pseudorandom number generator.
	 * By default the seed is generated randomly using Math.random().
	 */
	constructor(seed?: number);
	/**
	 * Returns a random float within the range [0, 1).
	 */
	next(): any;
	/**
	 * Returns a random integer within a given range.
	 * @param minValue The miniumum value of the random integer.
	 * @param maxValue The maximum value of the random integer (exclusive).
	 */
	range(minValue: number, maxValue: number): number;
}
//# sourceMappingURL=random.d.ts.map
