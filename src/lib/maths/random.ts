/**
 * Creates a pseudorandom number generator given a seed.
 * @param seed An integer used to initialize the pseudorandom number generator.
 * @remarks Code taken from https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
 * The original implementation can be found here https://gist.github.com/tommyettinger/46a874533244883189143505d203312c.
 */
function _mulberry32(seed: number) {
	return function () {
		var t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * A pseudorandom number generator.
 */
export default class Random {
	#generator: Function;

	/**
	 * Creates a pseudorandom number generator.
	 * @param seed An optional integer that can be used to seed the pseudorandom number generator.
	 * By default the seed is generated randomly using Math.random().
	 */
	constructor(seed?: number) {
		if (seed !== undefined) {
			this.#generator = _mulberry32(Math.floor(seed));
		} else {
			this.#generator = _mulberry32(
				Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
			);
		}
	}

	/**
	 * Returns a random float within the range [0, 1).
	 */
	public next() {
		return this.#generator();
	}

	/**
	 * Returns a random integer within a given range.
	 * @param minValue The miniumum value of the random integer.
	 * @param maxValue The maximum value of the random integer (exclusive).
	 */
	public range(minValue: number, maxValue: number) {
		if (maxValue < minValue) {
			throw new TypeError(
				"The 'maxValue' parameter must be greater than 'minValue' parameter."
			);
		}

		return minValue + Math.floor(this.#generator() * (maxValue - minValue));
	}
}
