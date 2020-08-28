/**
 * Returns a boolean value that is consistent with a given probability.
 * @param probability A float that represents how likely the roll is to be successful. This value should be with the range [0, 1].
 */
export declare function roll(probability: number): boolean;
/**
 * Returns a random float that depends on a gaussian (or normal) distribution.
 * @param mean The central value of your desired randomness.
 * @param standardDeviation The amount of variance from the mean of your desired randomness.
 */
export declare function gaussian(
	mean: number,
	standardDeviation: number
): number;
//# sourceMappingURL=randomHelper.d.ts.map
