/**
 * Given a number within a given range, remap said number to proportionally reflect a new range.
 * @param current The current value that will be remapped.
 * @param currentMin The lower bound of the given range the current value is within.
 * @param currentMax The upper bound of the given range the current value is within.
 * @param newMin The lower bound of the new range the current value will be within.
 * @param newMax The upper bound of the new range the current value will be within.
 */
export declare function remapRange(
	current: number,
	currentMin: number,
	currentMax: number,
	newMin: number,
	newMax: number
): number;
export declare function lerp(a: number, b: number, step: number): number;
export declare function lerpPrecise(a: number, b: number, step: number): number;
export declare function log(x: number, base: number): number;
//# sourceMappingURL=mathExt.d.ts.map
