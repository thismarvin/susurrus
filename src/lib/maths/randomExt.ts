/**
 * Returns a boolean value that is consistent with a given probability.
 * @param probability A float that represents how likely the roll is to be successful. This value should be with the range [0, 1].
 */
export function roll(probability: number) {
	if (probability <= 0) {
		return false;
	}

	if (probability >= 1) {
		return true;
	}

	return Math.random() <= probability;
}

/**
 * Returns a random float that depends on a gaussian (or normal) distribution.
 * @param mean The central value of your desired randomness.
 * @param standardDeviation The amount of variance from the mean of your desired randomness.
 */
export function gaussian(mean: number, standardDeviation: number) {
	const u1 = 1.0 - Math.random();
	const u2 = 1.0 - Math.random();
	const randStdNormal =
		Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

	return mean + standardDeviation * randStdNormal;
}
