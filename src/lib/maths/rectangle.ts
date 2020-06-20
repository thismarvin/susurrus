/**
 * An axis-aligned 2D-rectangle.
 */
export default class Rectangle {
	public x: number;
	public y: number;
	public width: number;
	public height: number;

	public get left() {
		return this.x;
	}
	public get top() {
		return this.y;
	}
	public get right() {
		return this.x + this.width;
	}
	public get bottom() {
		return this.y - this.height;
	}

	/**
	 * Creates an axis-aligned 2D-rectangle.
	 * @param x The x coordinate of the new rectangle's top-left corner.
	 * @param y The y coordinate of the new rectangle's top-left corner.
	 * @param width The width of the new rectangle.
	 * @param height The height of the new rectangle.
	 */
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	/**
	 * Returns whether or not this rectangle intersects with a given rectangle.
	 * @param rectangle The rectangle that will be tested against.
	 */
	public intersects(rectangle: Rectangle) {
		return (
			this.left < rectangle.right &&
			this.right > rectangle.left &&
			this.top > rectangle.bottom &&
			this.bottom < rectangle.top
		);
	}

	/**
	 * Returns whether or not this rectangle is completely within the boundaries of a given rectangle.
	 * @param rectangle The rectangle that will be tested against.
	 */
	public completelyWithin(rectangle: Rectangle) {
		return (
			this.left >= rectangle.left &&
			this.right <= rectangle.right &&
			this.bottom >= rectangle.bottom &&
			this.top <= rectangle.top
		);
	}
}
