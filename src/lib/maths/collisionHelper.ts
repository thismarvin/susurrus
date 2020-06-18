/* eslint-disable no-unused-vars */
import Rectangle from "./rectangle.js";
import * as Vector2Ext from "./vector2Ext.js";
import Vector2 from "./vector2.js";
import LineSegment from "./lineSegment.js";

interface IShape {
	vertices: Vector2[];
	edges: LineSegment[];
}

export function getResolutionAABB(a: Rectangle, b: Rectangle) {
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

	return _resolveSAT(
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

function _passSAT(a: IShape, b: IShape) {
	let edge = new LineSegment(0, 0, 0, 0);
	let minOverlap = Number.MAX_SAFE_INTEGER;

	for (let i = 0; i < a.edges.length; i++) {
		const normal = new Vector2(
			-(a.edges[i].y2 - a.edges[i].y1),
			a.edges[i].x2 - a.edges[i].x1
		);

		let minProjectionA = Vector2Ext.dot(a.vertices[0], normal);
		let maxProjectionA = minProjectionA;

		for (let j = 1; j < a.vertices.length; j++) {
			const projection = Vector2Ext.dot(a.vertices[j], normal);
			minProjectionA = Math.min(minProjectionA, projection);
			maxProjectionA = Math.max(maxProjectionA, projection);
		}

		let minProjectionB = Vector2Ext.dot(b.vertices[0], normal);
		let maxProjectionB = minProjectionB;

		for (let j = 1; j < b.vertices.length; j++) {
			const projection = Vector2Ext.dot(b.vertices[j], normal);
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

function _resolveSAT(a: IShape, b: IShape) {
	const aAABB = _calculateAABB(a.vertices);
	const bAABB = _calculateAABB(b.vertices);

	if (!aAABB.intersects(bAABB)) {
		return new Vector2(0, 0);
	}

	const pass0 = _passSAT(a, b);
	const pass1 = _passSAT(b, a);

	if (pass0 === null || pass1 === null) {
		return new Vector2(0, 0);
	}

	const mtv = pass0.overlap < pass1.overlap ? pass0 : pass1;

	const axis = new Vector2(
		-(mtv.edge.y2 - mtv.edge.y1),
		mtv.edge.x2 - mtv.edge.x1
	);

	const axisLength = axis.length();
	const angle = Math.acos(Vector2Ext.dot(axis, new Vector2(1, 0)) / axisLength);

	const xFactor = Math.round(axisLength * Math.cos(angle));
	const yFactor = Math.round(axisLength * Math.sin(angle));

	const xResolutionDirection = aAABB.left > bAABB.left ? 1 : -1;
	const yResolutionDirection = aAABB.bottom > bAABB.bottom ? 1 : -1;

	const xResolution =
		xFactor === 0 ? 0 : (mtv.overlap / xFactor) * xResolutionDirection;
	const yResolution =
		yFactor === 0 ? 0 : (mtv.overlap / yFactor) * yResolutionDirection;

	return new Vector2(xResolution, yResolution);
}
