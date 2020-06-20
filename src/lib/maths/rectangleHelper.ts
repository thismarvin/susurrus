// eslint-disable-next-line no-unused-vars
import Rectangle from "./rectangle.js";
import Vector2 from "./vector2.js";
import LineSegment from "./lineSegment.js";
import * as Collision from "./collisionHelper.js";

/**
 * Returns a vector that resolves collision between two rectangles.
 * @param a The target rectangle that will be resolved.
 * @param b The rectangle to resolve against.
 */
export function getResolution(a: Rectangle, b: Rectangle) {
	const aVertices = [
		new Vector2(a.left, a.top),
		new Vector2(a.right, a.top),
		new Vector2(a.right, a.bottom),
		new Vector2(a.left, a.bottom),
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
		new Vector2(b.left, b.top),
		new Vector2(b.right, b.top),
		new Vector2(b.right, b.bottom),
		new Vector2(b.left, b.bottom),
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
