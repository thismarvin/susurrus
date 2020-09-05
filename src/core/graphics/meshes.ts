import * as Graphics from "../../lib/graphics.js";

export const SQUARE = _createSquare();
export const TRIANGLE = _createTriangle();
export const CIRCLE = createRegularPolygonMesh(90);

/**
 * Creates a mesh of a filled regular polygon with a given amount of vertices.
 * @param totalVertices The total amount of vertices the regular polygon will have.
 */
export function createRegularPolygonMesh(totalVertices: number) {
	if (totalVertices <= 2) {
		throw new TypeError("A polygon must have at least 3 vertices.");
	}

	const twoPi = Math.PI * 2;

	const vertices: number[] = [];
	const indices: number[] = [];
	const totalTriangles = totalVertices - 2;
	const totalIndices = totalTriangles * 3;
	const angleIncrement = twoPi / totalVertices;

	for (let i = twoPi; i >= 0; i -= angleIncrement) {
		vertices.push(0.5 + Math.cos(i) * 0.5);
		vertices.push(-0.5 + Math.sin(i) * 0.5);
		vertices.push(0);

		if (vertices.length >= totalVertices * 3) {
			break;
		}
	}

	let j = 1;
	for (let i = 0; i < totalIndices; i += 3) {
		indices.push(0);
		indices.push(j + 1);
		indices.push(j);
		j++;
	}

	return new Graphics.Mesh(vertices, indices);
}

function _createSquare() {
	return new Graphics.Mesh(
		[0, 0, 0, 0, -1, 0, 1, -1, 0, 1, 0, 0],
		[0, 1, 2, 0, 2, 3]
	);
}

function _createTriangle() {
	const cos30 = Math.sqrt(3) / 2;
	return new Graphics.Mesh(
		[1 - cos30, 0, 0, 1, -0.5, 0, 1 - cos30, -1, 0],
		[0, 2, 1]
	);
}
