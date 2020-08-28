import * as Collision from "./collisionHelper.js";
import LineSegment from "./lineSegment.js";
import Vector2 from "./vector2.js";

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

	/**
	 * Returns a vector that resolves collision between this rectangle and a given rectangle.
	 * @param rectangle The rectangle to resolve against.
	 */
	public getResolution(rectangle: Rectangle) {
		const aVertices = [
			new Vector2(this.left, this.top),
			new Vector2(this.right, this.top),
			new Vector2(this.right, this.bottom),
			new Vector2(this.left, this.bottom),
		];

		const aEdges = [
			new LineSegment(
				aVertices[0].x,
				aVertices[0].y,
				aVertices[1].x,
				aVertices[1].y
			),
			new LineSegment(
				aVertices[1].x,
				aVertices[1].y,
				aVertices[2].x,
				aVertices[2].y
			),
		];

		const bVertices = [
			new Vector2(rectangle.left, rectangle.top),
			new Vector2(rectangle.right, rectangle.top),
			new Vector2(rectangle.right, rectangle.bottom),
			new Vector2(rectangle.left, rectangle.bottom),
		];

		const bEdges = [
			new LineSegment(
				bVertices[0].x,
				bVertices[0].y,
				bVertices[1].x,
				bVertices[1].y
			),
			new LineSegment(
				bVertices[1].x,
				bVertices[1].y,
				bVertices[2].x,
				bVertices[2].y
			),
		];

		return Collision.getResolution(
			{
				vertices: aVertices,
				edges: aEdges,
			},
			{
				vertices: bVertices,
				edges: bEdges,
			}
		);
	}
}
