/* eslint-disable no-unused-vars */
import Rectangle from "./rectangle.js";
import * as Vector2Ext from "./vector2Ext.js";
import Vector2 from "./vector2.js";
// eslint-disable-next-line no-unused-vars
import LineSegment from "./lineSegment.js";

interface IShape {
	bounds: Rectangle;
	vertices: Vector2[];
	lineSegments: LineSegment[];
}

export function getResolution(a: IShape, b: IShape) {
	if (!a.bounds.intersects(b.bounds)) return new Vector2(0, 0);

	const MTV = _calculateMTV(a, b);

	if (MTV === null) return new Vector2(0, 0);

	const axis = new Vector2(
		-(MTV.edge.y2 - MTV.edge.y1),
		MTV.edge.x2 - MTV.edge.x1
	);
	const edgeLength = axis.length();
	const angle = Math.acos(Vector2Ext.dot(axis, new Vector2(1, 0)) / edgeLength);

	const xFactor = Math.round(edgeLength * Math.cos(angle));
	const yFactor = Math.round(edgeLength * Math.sin(angle));

	const xResolutionDirection = a.bounds.left > b.bounds.left ? -1 : 1;
	const yResolutionDirection = a.bounds.bottom > b.bounds.bottom ? 1 : -1;

	const xResolution =
		xFactor === 0 ? 0 : (MTV.overlap / xFactor) * xResolutionDirection;
	const yResolution =
		yFactor === 0 ? 0 : (MTV.overlap / yFactor) * yResolutionDirection;

	return new Vector2(xResolution, yResolution);
}

function _getCollisionInformation(a: IShape, b: IShape) {
	const aLineSegments = a.lineSegments;

	const aVertices = a.vertices;
	const bVertices = b.vertices;

	let edge = new LineSegment(0, 0, 0, 0);
	let minOverlap = Number.MAX_SAFE_INTEGER;

	for (let i = 0; i < aLineSegments.length; i++) {
		const normal = new Vector2(
			-(aLineSegments[i].y2 - aLineSegments[i].y1),
			aLineSegments[i].x2 - aLineSegments[i].x1
		);

		let minProjectionA = Vector2Ext.dot(aVertices[0], normal);
		let maxProjectionA = minProjectionA;

		for (let j = 1; j < aVertices.length; j++) {
			const projection = Vector2Ext.dot(aVertices[j], normal);
			minProjectionA = Math.min(minProjectionA, projection);
			maxProjectionA = Math.max(maxProjectionA, projection);
		}

		let minProjectionB = Vector2Ext.dot(bVertices[0], normal);
		let maxProjectionB = minProjectionB;

		for (let j = 1; j < bVertices.length; j++) {
			const projection = Vector2Ext.dot(bVertices[j], normal);
			minProjectionB = Math.min(minProjectionB, projection);
			maxProjectionB = Math.max(maxProjectionB, projection);
		}

		const overlap =
			Math.min(maxProjectionA, maxProjectionB) -
			Math.max(minProjectionA, minProjectionB);

		if (overlap < minOverlap) {
			minOverlap = overlap;
			edge = aLineSegments[i];
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

function _calculateMTV(a: IShape, b: IShape) {
	const pass1 = _getCollisionInformation(a, b);
	const pass2 = _getCollisionInformation(b, a);

	if (pass1 === null || pass2 === null) return null;

	return pass1.overlap < pass2.overlap ? pass1 : pass2;
}
