import * as Maths from "../../../lib/maths.js";
// eslint-disable-next-line no-unused-vars
import Polygon from "./polygon.js";

export function createSchema(polygon: Polygon) {
	const transform = polygon.calculateTransform();
	const vertices = _transformVertices(polygon, transform);
	const lineSegments = _createLineSegments(vertices);

	return {
		vertices: vertices,
		lineSegments: lineSegments,
	};
}

function _transformVertices(polygon: Polygon, transform: Maths.Matrix4) {
	const totalVertices = polygon.mesh.totalVertices;
	const result: Maths.Vector3[] = new Array(totalVertices);

	for (let i = 0; i < result.length; i++) {
		result[i] = Maths.Vector3Ext.transform(
			new Maths.Vector3(
				polygon.mesh.vertices[i * 3],
				polygon.mesh.vertices[i * 3 + 1],
				polygon.mesh.vertices[i * 3 + 2]
			),
			transform
		);
	}

	return result;
}

function _createLineSegments(vertices: Maths.Vector3[]) {
	const totalVertices = vertices.length;
	const result: Maths.LineSegment[] = new Array(totalVertices);

	result[0] = new Maths.LineSegment(
		vertices[totalVertices - 1].x,
		vertices[totalVertices - 1].y,
		vertices[0].x,
		vertices[0].y
	);

	for (let i = 1; i < totalVertices; i++) {
		result[i] = new Maths.LineSegment(
			vertices[i - 1].x,
			vertices[i - 1].y,
			vertices[i].x,
			vertices[i].y
		);
	}

	return result;
}
