/* eslint-disable no-unused-vars */
import Rectangle from "./rectangle.js";
import Vector2 from "./vector2.js";
import LineSegment from "./lineSegment.js";

/**
 * Represents a convex polygon.
 */
interface IShape {
	vertices: Vector2[];
	edges: LineSegment[];
}

/**
 * Returns a vector that resolves collision between two convex polygons.
 * @param a The target convex polygon that will be resolved.
 * @param b The convex polygon to resolve against.
 */
export function getResolution(a: IShape, b: IShape) {
	const aAABB = _calculateAABB(a.vertices);
	const bAABB = _calculateAABB(b.vertices);

	if (!aAABB.intersects(bAABB)) {
		return new Vector2(0, 0);
	}

	const pass0 = _calculateOverlap(a, b);
	const pass1 = _calculateOverlap(b, a);

	if (pass0 === null || pass1 === null) {
		return new Vector2(0, 0);
	}

	const minPass = pass0.overlap < pass1.overlap ? pass0 : pass1;

	const axis = new Vector2(
		-(minPass.edge.y2 - minPass.edge.y1),
		minPass.edge.x2 - minPass.edge.x1
	);

	const axisLength = axis.length();
	const angle = Math.acos(Vector2.dot(axis, new Vector2(1, 0)) / axisLength);

	const xFactor = Math.round(axisLength * Math.cos(angle));
	const yFactor = Math.round(axisLength * Math.sin(angle));

	const xResolutionDirection = aAABB.left > bAABB.left ? 1 : -1;
	const yResolutionDirection = aAABB.bottom > bAABB.bottom ? 1 : -1;

	const xResolution =
		xFactor === 0 ? 0 : (minPass.overlap / xFactor) * xResolutionDirection;
	const yResolution =
		yFactor === 0 ? 0 : (minPass.overlap / yFactor) * yResolutionDirection;

	return new Vector2(xResolution, yResolution);
}

function _calculateAABB(vertices: Vector2[]) {
	let xMin = vertices[0].x;
	let xMax = xMin;
	let yMin = vertices[0].y;
	let yMax = yMin;

	for (let i = 1; i < vertices.length; i++) {
		xMin = Math.min(xMin, vertices[i].x);
		xMax = Math.max(xMax, vertices[i].x);
		yMin = Math.min(yMin, vertices[i].y);
		yMax = Math.max(yMax, vertices[i].y);
	}

	return new Rectangle(xMin, yMax, xMax - xMin, yMax - yMin);
}

function _calculateOverlap(a: IShape, b: IShape) {
	let edge = new LineSegment(0, 0, 0, 0);
	let minOverlap = Number.MAX_SAFE_INTEGER;

	for (let i = 0; i < a.edges.length; i++) {
		const normal = new Vector2(
			-(a.edges[i].y2 - a.edges[i].y1),
			a.edges[i].x2 - a.edges[i].x1
		);

		let minProjectionA = Vector2.dot(a.vertices[0], normal);
		let maxProjectionA = minProjectionA;

		for (let j = 1; j < a.vertices.length; j++) {
			const projection = Vector2.dot(a.vertices[j], normal);
			minProjectionA = Math.min(minProjectionA, projection);
			maxProjectionA = Math.max(maxProjectionA, projection);
		}

		let minProjectionB = Vector2.dot(b.vertices[0], normal);
		let maxProjectionB = minProjectionB;

		for (let j = 1; j < b.vertices.length; j++) {
			const projection = Vector2.dot(b.vertices[j], normal);
			minProjectionB = Math.min(minProjectionB, projection);
			maxProjectionB = Math.max(maxProjectionB, projection);
		}

		const overlap =
			Math.min(maxProjectionA, maxProjectionB) -
			Math.max(minProjectionA, minProjectionB);

		if (overlap < minOverlap) {
			minOverlap = overlap;
			edge = a.edges[i];
		}

		if (maxProjectionB < minProjectionA || maxProjectionA < minProjectionB) {
			return null;
		}
	}

	return {
		edge: edge,
		overlap: minOverlap,
	};
}
