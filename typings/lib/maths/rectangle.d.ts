import Vector2 from "./vector2.js";
/**
 * An axis-aligned 2D-rectangle.
 */
export default class Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
	get left(): number;
	get top(): number;
	get right(): number;
	get bottom(): number;
	/**
	 * Creates an axis-aligned 2D-rectangle.
	 * @param x The x coordinate of the new rectangle's top-left corner.
	 * @param y The y coordinate of the new rectangle's top-left corner.
	 * @param width The width of the new rectangle.
	 * @param height The height of the new rectangle.
	 */
	constructor(x: number, y: number, width: number, height: number);
	/**
	 * Returns whether or not this rectangle intersects with a given rectangle.
	 * @param rectangle The rectangle that will be tested against.
	 */
	intersects(rectangle: Rectangle): boolean;
	/**
	 * Returns whether or not this rectangle is completely within the boundaries of a given rectangle.
	 * @param rectangle The rectangle that will be tested against.
	 */
	completelyWithin(rectangle: Rectangle): boolean;
	/**
	 * Returns a vector that resolves collision between this rectangle and a given rectangle.
	 * @param rectangle The rectangle to resolve against.
	 */
	getResolution(rectangle: Rectangle): Vector2;
}
//# sourceMappingURL=rectangle.d.ts.map
