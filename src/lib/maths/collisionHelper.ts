/* eslint-disable no-unused-vars */
import Rectangle from "./rectangle.js";
import * as Vector2Ext from "./vector2Ext.js";
import Vector2 from "./vector2.js";
import LineSegment from "./lineSegment.js";

export function getResolutionAABB(a: Rectangle, b: Rectangle) {
	const aVertices = [
		new Vector2(a.left, a.top),
		new Vector2(a.right, a.top),
		new Vector2(a.right, a.bottom),
		new Vector2(a.left, a.bottom),
	];

	const bVertices = [
		new Vector2(b.left, b.top),
		new Vector2(b.right, b.top),
		new Vector2(b.right, b.bottom),
		new Vector2(b.left, b.bottom),
	];

	return _resolveSAT(aVertices, bVertices);
}

function _createAABB(vertices: Vector2[]) {
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

function _createLineSegments(vertices: Vector2[]) {
	const totalVertices = vertices.length;
	const result: LineSegment[] = new Array(totalVertices);

	result[0] = new LineSegment(
		vertices[totalVertices - 1].x,
		vertices[totalVertices - 1].y,
		vertices[0].x,
		vertices[0].y
	);

	for (let i = 1; i < totalVertices; i++) {
		result[i] = new LineSegment(
			vertices[i - 1].x,
			vertices[i - 1].y,
			vertices[i].x,
			vertices[i].y
		);
	}

	return result;
}

function _passSAT(aVertices: Vector2[], bVertices: Vector2[]) {
	const aLineSegments = _createLineSegments(aVertices);

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

function _resolveSAT(aVertices: Vector2[], bVertices: Vector2[]) {
	const aAABB = _createAABB(aVertices);
	const bAABB = _createAABB(bVertices);

	if (!aAABB.intersects(bAABB)) {
		return new Vector2(0, 0);
	}

	const pass0 = _passSAT(aVertices, bVertices);
	const pass1 = _passSAT(bVertices, aVertices);

	if (pass0 === null || pass1 === null) {
		return new Vector2(0, 0);
	}

	const mtv = pass0.overlap < pass1.overlap ? pass0 : pass1;

	const axis = new Vector2(
		-(mtv.edge.y2 - mtv.edge.y1),
		mtv.edge.x2 - mtv.edge.x1
	);
	const edgeLength = axis.length();
	const angle = Math.acos(Vector2Ext.dot(axis, new Vector2(1, 0)) / edgeLength);

	const xFactor = Math.round(edgeLength * Math.cos(angle));
	const yFactor = Math.round(edgeLength * Math.sin(angle));

	const xResolutionDirection = aAABB.left > bAABB.left ? -1 : 1;
	const yResolutionDirection = aAABB.bottom > bAABB.bottom ? 1 : -1;

	const xResolution =
		xFactor === 0 ? 0 : (mtv.overlap / xFactor) * xResolutionDirection;
	const yResolution =
		yFactor === 0 ? 0 : (mtv.overlap / yFactor) * yResolutionDirection;

	return new Vector2(xResolution, yResolution);
}
