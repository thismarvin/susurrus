/**
 * Given a number within a given range, remap said number to proportionally reflect a new range.
 * @param current The current value that will be remapped.
 * @param currentMin The lower bound of the given range the current value is within.
 * @param currentMax The upper bound of the given range the current value is within.
 * @param newMin The lower bound of the new range the current value will be within.
 * @param newMax The upper bound of the new range the current value will be within.
 */
export function remapRange(
	current: number,
	currentMin: number,
	currentMax: number,
	newMin: number,
	newMax: number
) {
	return (
		newMin +
		((newMax - newMin) * (current - currentMin)) / (currentMax - currentMin)
	);
}

export function lerp(a: number, b: number, step: number) {
	return a + step * (b - a);
}

export function lerpPrecise(a: number, b: number, step: number) {
	return (1 - step) * a + step * b;
}
