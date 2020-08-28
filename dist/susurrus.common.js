'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _intersectionPoint(lineSegment, t) {
	return {
		x: lineSegment.x1 + t * (lineSegment.x2 - lineSegment.x1),
		y: lineSegment.y1 + t * (lineSegment.y2 - lineSegment.y1),
	};
}
class LineSegment {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
	getIntersectionInformation(lineSegment) {
		const x3 = lineSegment.x1;
		const y3 = lineSegment.y1;
		const x4 = lineSegment.x2;
		const y4 = lineSegment.y2;
		const denominator =
			(this.x1 - this.x2) * (y3 - y4) - (this.y1 - this.y2) * (x3 - x4);
		if (denominator === 0) {
			return null;
		}
		let numerator = (this.x1 - x3) * (y3 - y4) - (this.y1 - y3) * (x3 - x4);
		const t = numerator / denominator;
		numerator =
			(this.x1 - this.x2) * (this.y1 - y3) -
			(this.y1 - this.y2) * (this.x1 - x3);
		const u = -numerator / denominator;
		return {
			t: t,
			u: u,
			intersected: 0 <= t && t <= 1 && 0 <= u && u <= 1,
			convergence: _intersectionPoint(this, t),
		};
	}
	intersects(lineSegment) {
		const result = this.getIntersectionInformation(lineSegment);
		return result === null ? false : result.intersected;
	}
}

/**
 * Given a number within a given range, remap said number to proportionally reflect a new range.
 * @param current The current value that will be remapped.
 * @param currentMin The lower bound of the given range the current value is within.
 * @param currentMax The upper bound of the given range the current value is within.
 * @param newMin The lower bound of the new range the current value will be within.
 * @param newMax The upper bound of the new range the current value will be within.
 */
function remapRange(current, currentMin, currentMax, newMin, newMax) {
	return (
		newMin +
		((newMax - newMin) * (current - currentMin)) / (currentMax - currentMin)
	);
}
function lerp(a, b, step) {
	return a + step * (b - a);
}
function lerpPrecise(a, b, step) {
	return (1 - step) * a + step * b;
}
function log(x, base) {
	switch (base) {
		case 2:
			return Math.log(x) / Math.LN2;
		case 10:
			return Math.log(x) / Math.LN10;
		default:
			return Math.log(x) / Math.log(base);
	}
}

var mathExt = /*#__PURE__*/Object.freeze({
	__proto__: null,
	remapRange: remapRange,
	lerp: lerp,
	lerpPrecise: lerpPrecise,
	log: log
});

class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	static get ZERO() {
		return new Vector2(0, 0);
	}
	static get ONE() {
		return new Vector2(1, 1);
	}
	static get UNIT_X() {
		return new Vector2(1, 0);
	}
	static get UNIT_Y() {
		return new Vector2(0, 1);
	}
	length() {
		return Math.sqrt(this.lengthSquared());
	}
	lengthSquared() {
		return this.x ** 2 + this.y ** 2;
	}
	normalize() {
		const magnitude = this.length();
		const temp = 1 / magnitude;
		this.x *= temp;
		this.y *= temp;
		return this;
	}
	copy(vector) {
		this.x = vector.x;
		this.y = vector.y;
	}
	clone() {
		return new Vector2(this.x, this.y);
	}
	toArray() {
		return [this.x, this.y];
	}
	toString() {
		return `(${this.x}, ${this.y})`;
	}
	//#region Static Methods
	static distanceSquared(a, b) {
		const x = a.x - b.x;
		const y = a.y - b.y;
		return x ** 2 + y ** 2;
	}
	static distance(a, b) {
		return Math.sqrt(Vector2.distanceSquared(a, b));
	}
	static dot(a, b) {
		return a.x * b.x + a.y * b.y;
	}
	static lerp(a, b, step) {
		const x = lerp(a.x, b.x, step);
		const y = lerp(a.y, b.y, step);
		return new Vector2(x, y);
	}
	static lerpPrecise(a, b, step) {
		const x = lerpPrecise(a.x, b.x, step);
		const y = lerpPrecise(a.y, b.y, step);
		return new Vector2(x, y);
	}
	static polarToCartesian(radius, theta) {
		return new Vector2(radius * Math.cos(theta), radius * Math.sin(theta));
	}
	static fromAngle(theta) {
		return Vector2.polarToCartesian(1, theta);
	}
	static random() {
		return Vector2.fromAngle(Math.random() * Math.PI * 2);
	}
	static add(a, b) {
		const x = a.x + b.x;
		const y = a.y + b.y;
		return new Vector2(x, y);
	}
	static subtract(a, b) {
		const x = a.x - b.x;
		const y = a.y - b.y;
		return new Vector2(x, y);
	}
	static multiply(a, b) {
		const x = a.x * b.x;
		const y = a.y * b.y;
		return new Vector2(x, y);
	}
	static divide(a, b) {
		const x = a.x / b.x;
		const y = a.y / b.y;
		return new Vector2(x, y);
	}
	static addScalar(a, scalar) {
		const x = a.x + scalar;
		const y = a.y + scalar;
		return new Vector2(x, y);
	}
	static subtractScalar(a, scalar) {
		const x = a.x - scalar;
		const y = a.y - scalar;
		return new Vector2(x, y);
	}
	static multiplyScalar(a, scalar) {
		const x = a.x * scalar;
		const y = a.y * scalar;
		return new Vector2(x, y);
	}
	static divideScalar(a, scalar) {
		const x = a.x / scalar;
		const y = a.y / scalar;
		return new Vector2(x, y);
	}
	static transform(a, b) {
		const x = a.x * b.data[0] + a.y * b.data[4] + b.data[12];
		const y = a.x * b.data[1] + a.y * b.data[5] + b.data[13];
		return new Vector2(x, y);
	}
}

/**
 * An axis-aligned 2D-rectangle.
 */
class Rectangle {
	/**
	 * Creates an axis-aligned 2D-rectangle.
	 * @param x The x coordinate of the new rectangle's top-left corner.
	 * @param y The y coordinate of the new rectangle's top-left corner.
	 * @param width The width of the new rectangle.
	 * @param height The height of the new rectangle.
	 */
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	get left() {
		return this.x;
	}
	get top() {
		return this.y;
	}
	get right() {
		return this.x + this.width;
	}
	get bottom() {
		return this.y - this.height;
	}
	/**
	 * Returns whether or not this rectangle intersects with a given rectangle.
	 * @param rectangle The rectangle that will be tested against.
	 */
	intersects(rectangle) {
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
	completelyWithin(rectangle) {
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
	getResolution(rectangle) {
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
		return getResolution(
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

/* eslint-disable no-unused-vars */
/**
 * Returns a vector that resolves collision between two convex polygons.
 * @param a The target convex polygon that will be resolved.
 * @param b The convex polygon to resolve against.
 */
function getResolution(a, b) {
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
function _calculateAABB(vertices) {
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
function _calculateOverlap(a, b) {
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

var collisionHelper = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getResolution: getResolution
});

var __classPrivateFieldSet =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _rows, _columns, _data;
class Matrix {
	constructor(rows, columns, data) {
		_rows.set(this, void 0);
		_columns.set(this, void 0);
		_data.set(this, void 0);
		__classPrivateFieldSet(this, _rows, rows);
		__classPrivateFieldSet(this, _columns, columns);
		__classPrivateFieldSet(
			this,
			_data,
			new Array(
				__classPrivateFieldGet(this, _rows) *
					__classPrivateFieldGet(this, _columns)
			).fill(0)
		);
		if (data !== undefined) {
			this.setData(data);
		}
	}
	get rows() {
		return __classPrivateFieldGet(this, _rows);
	}
	get columns() {
		return __classPrivateFieldGet(this, _columns);
	}
	get data() {
		return __classPrivateFieldGet(this, _data);
	}
	get(x, y) {
		return this.data[this.columns * y + x];
	}
	setData(data) {
		if (data.length !== this.rows * this.columns) {
			throw new TypeError(
				"The given data does not match the dimensions of the matrix."
			);
		}
		__classPrivateFieldSet(this, _data, data.slice(0));
	}
	set(x, y, value) {
		__classPrivateFieldGet(this, _data)[this.columns * y + x] = value;
	}
	transpose() {
		const temp = new Array(this.rows * this.columns).fill(0);
		const newRows = this.columns;
		const newColumns = this.rows;
		for (let y = 0; y < newRows; y++) {
			for (let x = 0; x < newColumns; x++) {
				temp[newColumns * y + x] = this.data[this.columns * x + y];
			}
		}
		__classPrivateFieldSet(this, _data, temp);
	}
	toString() {
		let string = "";
		for (
			let i = 0;
			i < __classPrivateFieldGet(this, _data).length;
			i += this.columns
		) {
			string += `(${__classPrivateFieldGet(this, _data)[i]}`;
			for (let j = 1; j < this.columns; j++) {
				string += ` ${__classPrivateFieldGet(this, _data)[i + j]}`;
			}
			string += ")";
			if (i !== __classPrivateFieldGet(this, _data).length - this.columns) {
				string += " ";
			}
		}
		return string;
	}
	//#region Static Methods
	static add(a, b) {
		// Make sure we can even add the matrices.
		if (a.rows !== b.rows || a.columns !== b.columns) {
			throw new TypeError(
				"Both matrices are not the same size; cannot perform operation."
			);
		}
		const temp = a.data.slice(0);
		for (let i = 0; i < a.data.length; i++) {
			temp[i] += b.data[i];
		}
		return new Matrix(a.rows, a.columns, temp);
	}
	static subtract(a, b) {
		// Make sure we can even add the matrices.
		if (a.rows !== b.rows || a.columns !== b.columns) {
			throw new TypeError(
				"Both matrices are not the same size; cannot perform operation."
			);
		}
		const temp = a.data.slice(0);
		for (let i = 0; i < a.rows * a.columns; i++) {
			temp[i] -= b.data[i];
		}
		return new Matrix(a.rows, b.rows, temp);
	}
	static multiply(a, b) {
		// Make sure we can even multiply the matrices.
		if (a.columns !== b.rows) {
			throw new TypeError(
				`Matrix b must have ${a.columns} rows; cannot multiply matrices.`
			);
		}
		const result = new Matrix(a.rows, b.columns);
		for (let ay = 0; ay < a.rows; ay++) {
			for (let bx = 0; bx < b.columns; bx++) {
				let temp = 0;
				for (let ax = 0; ax < a.columns; ax++) {
					temp += a.get(ax, ay) * b.get(bx, ax);
				}
				result.set(bx, ay, temp);
			}
		}
		return result;
	}
	static addScalar(a, scalar) {
		const temp = a.data.slice(0);
		for (let i = 0; i < a.data.length; i++) {
			temp[i] += scalar;
		}
		return new Matrix(a.rows, a.columns, temp);
	}
	static subtractScalar(a, scalar) {
		const temp = a.data.slice(0);
		for (let i = 0; i < a.data.length; i++) {
			temp[i] -= scalar;
		}
		return new Matrix(a.rows, a.columns, temp);
	}
	static multiplyScalar(a, scalar) {
		const temp = a.data.slice(0);
		for (let i = 0; i < a.data.length; i++) {
			temp[i] *= scalar;
		}
		return new Matrix(a.rows, a.columns, temp);
	}
	static divideScalar(a, scalar) {
		const temp = 1 / scalar;
		return Matrix.multiplyScalar(a, temp);
	}
}
(_rows = new WeakMap()), (_columns = new WeakMap()), (_data = new WeakMap());

class Vector3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	static get ZERO() {
		return new Vector3(0, 0, 0);
	}
	static get ONE() {
		return new Vector3(1, 1, 1);
	}
	static get UNIT_X() {
		return new Vector3(1, 0, 0);
	}
	static get UNIT_Y() {
		return new Vector3(0, 1, 0);
	}
	static get UNIT_Z() {
		return new Vector3(0, 0, 1);
	}
	static get LEFT() {
		return new Vector3(-1, 0, 0);
	}
	static get UP() {
		return new Vector3(0, 1, 0);
	}
	static get RIGHT() {
		return new Vector3(1, 0, 0);
	}
	static get DOWN() {
		return new Vector3(0, -1, 0);
	}
	static get FORWARD() {
		return new Vector3(0, 0, -1);
	}
	static get BACKWARD() {
		return new Vector3(0, 0, 1);
	}
	length() {
		return Math.sqrt(this.lengthSquared());
	}
	lengthSquared() {
		return this.x ** 2 + this.y ** 2 + this.z ** 2;
	}
	normalize() {
		const magnitude = this.length();
		const temp = 1 / magnitude;
		this.x *= temp;
		this.y *= temp;
		this.z *= temp;
		return this;
	}
	copy(vector) {
		this.x = vector.x;
		this.y = vector.y;
		this.z = vector.z;
	}
	clone() {
		return new Vector3(this.x, this.y, this.z);
	}
	toArray() {
		return [this.x, this.y, this.z];
	}
	toString() {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}
	//#region Static Methods
	static distanceSquared(a, b) {
		const x = a.x - b.x;
		const y = a.y - b.y;
		const z = a.z - b.z;
		return x ** 2 + y ** 2 + z ** 2;
	}
	static distance(a, b) {
		return Math.sqrt(Vector3.distanceSquared(a, b));
	}
	static dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	static lerp(a, b, step) {
		const x = lerp(a.x, b.x, step);
		const y = lerp(a.y, b.y, step);
		const z = lerp(a.z, b.z, step);
		return new Vector3(x, y, z);
	}
	static lerpPrecise(a, b, step) {
		const x = lerpPrecise(a.x, b.x, step);
		const y = lerpPrecise(a.y, b.y, step);
		const z = lerpPrecise(a.z, b.z, step);
		return new Vector3(x, y, z);
	}
	/**
	 * Converts spherical coordinates into Cartesian coordinates (represented as a Vector3).
	 * @param radius The distance between the origin and the new point.
	 * @param inclination The angle between the point and y axis (latitude).
	 * @param azimuth The angle between the point and z axis (longitude).
	 */
	static sphericalToCartesian(radius, inclination, azimuth) {
		// Normally azimuth and inclination would be swapped in this formula.
		// However, because of OpenGL's coordinate system, they were switched around for the sake of convenience.
		return new Vector3(
			radius * Math.sin(azimuth) * Math.cos(inclination),
			radius * Math.sin(azimuth) * Math.sin(inclination),
			radius * Math.cos(azimuth)
		);
	}
	static cross(a, b) {
		const x = a.y * b.z - b.y * a.z;
		const y = a.z * b.x - b.z * a.x;
		const z = a.x * b.y - b.x * a.y;
		return new Vector3(x, y, z);
	}
	static add(a, b) {
		const x = a.x + b.x;
		const y = a.y + b.y;
		const z = a.z + b.z;
		return new Vector3(x, y, z);
	}
	static subtract(a, b) {
		const x = a.x - b.x;
		const y = a.y - b.y;
		const z = a.z - b.z;
		return new Vector3(x, y, z);
	}
	static multiply(a, b) {
		const x = a.x * b.x;
		const y = a.y * b.y;
		const z = a.z * b.z;
		return new Vector3(x, y, z);
	}
	static divide(a, b) {
		const x = a.x / b.x;
		const y = a.y / b.y;
		const z = a.z / b.z;
		return new Vector3(x, y, z);
	}
	static addScalar(a, scalar) {
		const x = a.x + scalar;
		const y = a.y + scalar;
		const z = a.z + scalar;
		return new Vector3(x, y, z);
	}
	static subtractScalar(a, scalar) {
		const x = a.x - scalar;
		const y = a.y - scalar;
		const z = a.z - scalar;
		return new Vector3(x, y, z);
	}
	static multiplyScalar(a, scalar) {
		const x = a.x * scalar;
		const y = a.y * scalar;
		const z = a.z * scalar;
		return new Vector3(x, y, z);
	}
	static divideScalar(a, scalar) {
		const x = a.x / scalar;
		const y = a.y / scalar;
		const z = a.z / scalar;
		return new Vector3(x, y, z);
	}
	static transform(a, b) {
		const x = a.x * b.data[0] + a.y * b.data[4] + a.z * b.data[8] + b.data[12];
		const y = a.x * b.data[1] + a.y * b.data[5] + a.z * b.data[9] + b.data[13];
		const z = a.x * b.data[2] + a.y * b.data[6] + a.z * b.data[10] + b.data[14];
		return new Vector3(x, y, z);
	}
}

var __classPrivateFieldSet$1 =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$1 =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _rows$1, _columns$1, _data$1;
function _getEmptyData() {
	return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}
function _getIdentityData() {
	return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}
class Matrix4 {
	constructor(data) {
		_rows$1.set(this, void 0);
		_columns$1.set(this, void 0);
		_data$1.set(this, void 0);
		__classPrivateFieldSet$1(this, _rows$1, 4);
		__classPrivateFieldSet$1(this, _columns$1, 4);
		__classPrivateFieldSet$1(
			this,
			_data$1,
			new Array(
				__classPrivateFieldGet$1(this, _rows$1) *
					__classPrivateFieldGet$1(this, _columns$1)
			).fill(0)
		);
		if (data !== undefined) {
			this.setData(data);
		}
	}
	get rows() {
		return __classPrivateFieldGet$1(this, _rows$1);
	}
	get columns() {
		return __classPrivateFieldGet$1(this, _columns$1);
	}
	get data() {
		return __classPrivateFieldGet$1(this, _data$1);
	}
	static get IDENTITY() {
		return new Matrix4(_getIdentityData());
	}
	setData(data) {
		if (
			data.length !==
			__classPrivateFieldGet$1(this, _rows$1) *
				__classPrivateFieldGet$1(this, _columns$1)
		) {
			throw new TypeError(
				"The given data does not match the dimensions of the matrix."
			);
		}
		__classPrivateFieldSet$1(this, _data$1, data.slice(0));
	}
	get(x, y) {
		return __classPrivateFieldGet$1(this, _data$1)[
			__classPrivateFieldGet$1(this, _columns$1) * y + x
		];
	}
	set(x, y, value) {
		__classPrivateFieldGet$1(this, _data$1)[
			__classPrivateFieldGet$1(this, _columns$1) * y + x
		] = value;
	}
	transpose() {
		const temp = _getEmptyData();
		temp[0] = __classPrivateFieldGet$1(this, _data$1)[0];
		temp[1] = __classPrivateFieldGet$1(this, _data$1)[4];
		temp[2] = __classPrivateFieldGet$1(this, _data$1)[8];
		temp[3] = __classPrivateFieldGet$1(this, _data$1)[12];
		temp[4] = __classPrivateFieldGet$1(this, _data$1)[1];
		temp[5] = __classPrivateFieldGet$1(this, _data$1)[5];
		temp[6] = __classPrivateFieldGet$1(this, _data$1)[9];
		temp[7] = __classPrivateFieldGet$1(this, _data$1)[13];
		temp[8] = __classPrivateFieldGet$1(this, _data$1)[2];
		temp[9] = __classPrivateFieldGet$1(this, _data$1)[6];
		temp[10] = __classPrivateFieldGet$1(this, _data$1)[10];
		temp[11] = __classPrivateFieldGet$1(this, _data$1)[14];
		temp[12] = __classPrivateFieldGet$1(this, _data$1)[3];
		temp[13] = __classPrivateFieldGet$1(this, _data$1)[7];
		temp[14] = __classPrivateFieldGet$1(this, _data$1)[11];
		temp[15] = __classPrivateFieldGet$1(this, _data$1)[15];
		__classPrivateFieldSet$1(this, _data$1, temp);
	}
	toString() {
		return `(${this.data[0]}, ${this.data[1]}, ${this.data[2]}, ${this.data[3]}) (${this.data[4]}, ${this.data[5]}, ${this.data[6]}, ${this.data[7]}) (${this.data[8]}, ${this.data[9]}, ${this.data[10]}, ${this.data[11]}) (${this.data[12]}, ${this.data[13]}, ${this.data[14]}, ${this.data[15]})`;
	}
	//#region Math
	static add(a, b) {
		const temp = a.data.slice(0);
		for (let i = 0; i < temp.length; i++) {
			temp[i] += b.data[i];
		}
		return new Matrix4(temp);
	}
	static subtract(a, b) {
		const temp = a.data.slice(0);
		for (let i = 0; i < temp.length; i++) {
			temp[i] -= b.data[i];
		}
		return new Matrix4(temp);
	}
	static multiply(a, b) {
		const temp = new Array(16).fill(0);
		temp[0] =
			a.data[0] * b.data[0] +
			a.data[1] * b.data[4] +
			a.data[2] * b.data[8] +
			a.data[3] * b.data[12];
		temp[1] =
			a.data[0] * b.data[1] +
			a.data[1] * b.data[5] +
			a.data[2] * b.data[9] +
			a.data[3] * b.data[13];
		temp[2] =
			a.data[0] * b.data[2] +
			a.data[1] * b.data[6] +
			a.data[2] * b.data[10] +
			a.data[3] * b.data[14];
		temp[3] =
			a.data[0] * b.data[3] +
			a.data[1] * b.data[7] +
			a.data[2] * b.data[11] +
			a.data[3] * b.data[15];
		temp[4] =
			a.data[4] * b.data[0] +
			a.data[5] * b.data[4] +
			a.data[6] * b.data[8] +
			a.data[7] * b.data[12];
		temp[5] =
			a.data[4] * b.data[1] +
			a.data[5] * b.data[5] +
			a.data[6] * b.data[9] +
			a.data[7] * b.data[13];
		temp[6] =
			a.data[4] * b.data[2] +
			a.data[5] * b.data[6] +
			a.data[6] * b.data[10] +
			a.data[7] * b.data[14];
		temp[7] =
			a.data[4] * b.data[3] +
			a.data[5] * b.data[7] +
			a.data[6] * b.data[11] +
			a.data[7] * b.data[15];
		temp[8] =
			a.data[8] * b.data[0] +
			a.data[9] * b.data[4] +
			a.data[10] * b.data[8] +
			a.data[11] * b.data[12];
		temp[9] =
			a.data[8] * b.data[1] +
			a.data[9] * b.data[5] +
			a.data[10] * b.data[9] +
			a.data[11] * b.data[13];
		temp[10] =
			a.data[8] * b.data[2] +
			a.data[9] * b.data[6] +
			a.data[10] * b.data[10] +
			a.data[11] * b.data[14];
		temp[11] =
			a.data[8] * b.data[3] +
			a.data[9] * b.data[7] +
			a.data[10] * b.data[11] +
			a.data[11] * b.data[15];
		temp[12] =
			a.data[12] * b.data[0] +
			a.data[13] * b.data[4] +
			a.data[14] * b.data[8] +
			a.data[15] * b.data[12];
		temp[13] =
			a.data[12] * b.data[1] +
			a.data[13] * b.data[5] +
			a.data[14] * b.data[9] +
			a.data[15] * b.data[13];
		temp[14] =
			a.data[12] * b.data[2] +
			a.data[13] * b.data[6] +
			a.data[14] * b.data[10] +
			a.data[15] * b.data[14];
		temp[15] =
			a.data[12] * b.data[3] +
			a.data[13] * b.data[7] +
			a.data[14] * b.data[11] +
			a.data[15] * b.data[15];
		return new Matrix4(temp);
	}
	static addScalar(a, scalar) {
		const temp = a.data.slice(0);
		for (let i = 0; i < temp.length; i++) {
			temp[i] += scalar;
		}
		return new Matrix4(temp);
	}
	static subtractScalar(a, scalar) {
		const temp = a.data.slice(0);
		for (let i = 0; i < temp.length; i++) {
			temp[i] -= scalar;
		}
		return new Matrix4(temp);
	}
	static multiplyScalar(a, scalar) {
		const temp = a.data.slice(0);
		for (let i = 0; i < temp.length; i++) {
			temp[i] *= scalar;
		}
		return new Matrix4(temp);
	}
	static divideScalar(a, scalar) {
		const temp = 1 / scalar;
		return Matrix4.multiplyScalar(a, temp);
	}
	//#endregion
	//#region Affine Transformations
	static createRotationX(angle) {
		const temp = _getIdentityData();
		temp[5] = Math.cos(angle);
		temp[6] = Math.sin(angle);
		temp[9] = -Math.sin(angle);
		temp[10] = Math.cos(angle);
		return new Matrix4(temp);
	}
	static createRotationY(angle) {
		const temp = _getIdentityData();
		temp[0] = Math.cos(angle);
		temp[2] = -Math.sin(angle);
		temp[8] = Math.sin(angle);
		temp[10] = Math.cos(angle);
		return new Matrix4(temp);
	}
	static createRotationZ(angle) {
		const temp = _getIdentityData();
		temp[0] = Math.cos(angle);
		temp[1] = Math.sin(angle);
		temp[4] = -Math.sin(angle);
		temp[5] = Math.cos(angle);
		return new Matrix4(temp);
	}
	static createTranslation(x, y, z) {
		const temp = _getIdentityData();
		temp[12] = x;
		temp[13] = y;
		temp[14] = z;
		return new Matrix4(temp);
	}
	static createScale(x, y, z) {
		const temp = _getIdentityData();
		temp[0] = x;
		temp[5] = y;
		temp[10] = z;
		return new Matrix4(temp);
	}
	static createOrthographic(width, height, near, far) {
		const temp = _getIdentityData();
		const fn = 1 / (far - near);
		temp[0] = 2 / width;
		temp[5] = 2 / height;
		temp[10] = -2 * fn;
		temp[14] = -(far + near) * fn;
		return new Matrix4(temp);
	}
	static createOrthographicOffCenter(left, right, bottom, top, near, far) {
		const temp = _getEmptyData();
		const rl = 1 / (right - left);
		const tb = 1 / (top - bottom);
		const fn = 1 / (far - near);
		temp[0] = 2 * rl;
		temp[5] = 2 * tb;
		temp[10] = -2 * fn;
		temp[12] = -(right + left) * rl;
		temp[13] = -(top + bottom) * tb;
		temp[14] = -(far + near) * fn;
		temp[15] = 1;
		return new Matrix4(temp);
	}
	static createPerspective(width, height, near, far) {
		const temp = _getEmptyData();
		const fn = 1 / (far - near);
		temp[0] = (2 * near) / width;
		temp[5] = (2 * near) / height;
		temp[10] = -(far + near) * fn;
		temp[11] = -1;
		temp[14] = -2 * far * near * fn;
		return new Matrix4(temp);
	}
	static createPerspectiveOffCenter(left, right, bottom, top, near, far) {
		const temp = _getEmptyData();
		const rl = 1 / (right - left);
		const tb = 1 / (top - bottom);
		const fn = 1 / (far - near);
		temp[0] = 2 * near * rl;
		temp[5] = 2 * near * tb;
		temp[8] = (right + left) * rl;
		temp[9] = (top + bottom) * tb;
		temp[10] = -(far + near) * fn;
		temp[11] = -1;
		temp[14] = -2 * far * near * fn;
		return new Matrix4(temp);
	}
	static createLookAt(cameraPosition, cameraTarget, cameraUp) {
		const a = Vector3.subtract(cameraPosition, cameraTarget).normalize();
		const b = Vector3.cross(cameraUp, a).normalize();
		const c = Vector3.cross(a, b);
		const temp = _getIdentityData();
		temp[0] = b.x;
		temp[1] = c.x;
		temp[2] = a.x;
		temp[4] = b.y;
		temp[5] = c.y;
		temp[6] = a.y;
		temp[8] = b.z;
		temp[9] = c.z;
		temp[10] = a.z;
		temp[12] = -Vector3.dot(b, cameraPosition);
		temp[13] = -Vector3.dot(c, cameraPosition);
		temp[14] = -Vector3.dot(a, cameraPosition);
		return new Matrix4(temp);
	}
}
(_rows$1 = new WeakMap()), (_columns$1 = new WeakMap()), (_data$1 = new WeakMap());

var __classPrivateFieldSet$2 =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$2 =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _generator;
/**
 * Creates a pseudorandom number generator given a seed.
 * @param seed An integer used to initialize the pseudorandom number generator.
 * @remarks Code taken from https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
 * The original implementation can be found here https://gist.github.com/tommyettinger/46a874533244883189143505d203312c.
 */
function _mulberry32(seed) {
	return function () {
		var t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
/**
 * A pseudorandom number generator.
 */
class Random {
	/**
	 * Creates a pseudorandom number generator.
	 * @param seed An optional integer that can be used to seed the pseudorandom number generator.
	 * By default the seed is generated randomly using Math.random().
	 */
	constructor(seed) {
		_generator.set(this, void 0);
		if (seed !== undefined) {
			__classPrivateFieldSet$2(this, _generator, _mulberry32(Math.floor(seed)));
		} else {
			__classPrivateFieldSet$2(
				this,
				_generator,
				_mulberry32(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
			);
		}
	}
	/**
	 * Returns a random float within the range [0, 1).
	 */
	next() {
		return __classPrivateFieldGet$2(this, _generator).call(this);
	}
	/**
	 * Returns a random integer within a given range.
	 * @param minValue The miniumum value of the random integer.
	 * @param maxValue The maximum value of the random integer (exclusive).
	 */
	range(minValue, maxValue) {
		if (maxValue < minValue) {
			throw new TypeError(
				"The 'maxValue' parameter must be greater than 'minValue' parameter."
			);
		}
		return (
			minValue +
			Math.floor(
				__classPrivateFieldGet$2(this, _generator).call(this) *
					(maxValue - minValue)
			)
		);
	}
}
_generator = new WeakMap();

/**
 * Returns a boolean value that is consistent with a given probability.
 * @param probability A float that represents how likely the roll is to be successful. This value should be with the range [0, 1].
 */
function roll(probability) {
	if (probability <= 0) {
		return false;
	}
	if (probability >= 1) {
		return true;
	}
	return Math.random() <= probability;
}
/**
 * Returns a random float that depends on a gaussian (or normal) distribution.
 * @param mean The central value of your desired randomness.
 * @param standardDeviation The amount of variance from the mean of your desired randomness.
 */
function gaussian(mean, standardDeviation) {
	const u1 = 1.0 - Math.random();
	const u2 = 1.0 - Math.random();
	const randStdNormal =
		Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
	return mean + standardDeviation * randStdNormal;
}

var randomHelper = /*#__PURE__*/Object.freeze({
	__proto__: null,
	roll: roll,
	gaussian: gaussian
});

var __classPrivateFieldSet$3 =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$3 =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _target,
	_position,
	_up,
	_near,
	_far,
	_width,
	_height,
	_projectionType,
	_world,
	_view,
	_projection,
	_wvp;
function _createWVP(world, view, projection) {
	const mul = Matrix4.multiply;
	return mul(mul(world, view), projection);
}
var ProjectionType;
(function (ProjectionType) {
	// eslint-disable-next-line no-unused-vars
	ProjectionType[(ProjectionType["None"] = 0)] = "None";
	// eslint-disable-next-line no-unused-vars
	ProjectionType[(ProjectionType["Orthographic"] = 1)] = "Orthographic";
	// eslint-disable-next-line no-unused-vars
	ProjectionType[(ProjectionType["Perspective"] = 2)] = "Perspective";
})(ProjectionType || (ProjectionType = {}));
class Camera {
	constructor() {
		_target.set(this, void 0);
		_position.set(this, void 0);
		_up.set(this, void 0);
		_near.set(this, void 0);
		_far.set(this, void 0);
		_width.set(this, void 0);
		_height.set(this, void 0);
		_projectionType.set(this, void 0);
		_world.set(this, void 0);
		_view.set(this, void 0);
		_projection.set(this, void 0);
		_wvp.set(this, void 0);
		__classPrivateFieldSet$3(this, _target, Vector3.ZERO);
		__classPrivateFieldSet$3(
			this,
			_position,
			new Vector3(
				__classPrivateFieldGet$3(this, _target).x,
				__classPrivateFieldGet$3(this, _target).y,
				__classPrivateFieldGet$3(this, _target).z + 1
			)
		);
		__classPrivateFieldSet$3(this, _up, Vector3.UP);
		__classPrivateFieldSet$3(this, _near, 0);
		__classPrivateFieldSet$3(this, _far, 0);
		__classPrivateFieldSet$3(this, _width, 0);
		__classPrivateFieldSet$3(this, _height, 0);
		__classPrivateFieldSet$3(this, _projectionType, ProjectionType.None);
		__classPrivateFieldSet$3(this, _world, Matrix4.IDENTITY);
		__classPrivateFieldSet$3(
			this,
			_view,
			Matrix4.createLookAt(
				__classPrivateFieldGet$3(this, _position),
				__classPrivateFieldGet$3(this, _target),
				__classPrivateFieldGet$3(this, _up)
			)
		);
		__classPrivateFieldSet$3(this, _projection, Matrix4.IDENTITY);
		__classPrivateFieldSet$3(this, _wvp, Matrix4.IDENTITY);
	}
	get wvp() {
		return __classPrivateFieldGet$3(this, _wvp);
	}
	get bounds() {
		return new Rectangle(
			__classPrivateFieldGet$3(this, _position).x,
			__classPrivateFieldGet$3(this, _position).y,
			__classPrivateFieldGet$3(this, _width),
			__classPrivateFieldGet$3(this, _height)
		);
	}
	createOrthographic(width, height, near, far) {
		__classPrivateFieldSet$3(this, _width, width);
		__classPrivateFieldSet$3(this, _height, height);
		__classPrivateFieldSet$3(this, _near, near === undefined ? 0 : near);
		__classPrivateFieldSet$3(this, _far, far === undefined ? 0 : far);
		__classPrivateFieldSet$3(this, _projectionType, ProjectionType.Orthographic);
		__classPrivateFieldSet$3(
			this,
			_projection,
			Matrix4.createOrthographic(
				__classPrivateFieldGet$3(this, _width),
				__classPrivateFieldGet$3(this, _height),
				__classPrivateFieldGet$3(this, _near),
				__classPrivateFieldGet$3(this, _far)
			)
		);
		__classPrivateFieldSet$3(
			this,
			_wvp,
			_createWVP(
				__classPrivateFieldGet$3(this, _world),
				__classPrivateFieldGet$3(this, _view),
				__classPrivateFieldGet$3(this, _projection)
			)
		);
		return this;
	}
	createPerspective(width, height, near, far) {
		__classPrivateFieldSet$3(this, _width, width);
		__classPrivateFieldSet$3(this, _height, height);
		__classPrivateFieldSet$3(this, _near, near === undefined ? 0 : near);
		__classPrivateFieldSet$3(this, _far, far === undefined ? 0 : far);
		__classPrivateFieldSet$3(this, _projectionType, ProjectionType.Perspective);
		__classPrivateFieldSet$3(
			this,
			_projection,
			Matrix4.createPerspective(
				__classPrivateFieldGet$3(this, _width),
				__classPrivateFieldGet$3(this, _height),
				__classPrivateFieldGet$3(this, _near),
				__classPrivateFieldGet$3(this, _far)
			)
		);
		__classPrivateFieldSet$3(
			this,
			_wvp,
			_createWVP(
				__classPrivateFieldGet$3(this, _world),
				__classPrivateFieldGet$3(this, _view),
				__classPrivateFieldGet$3(this, _projection)
			)
		);
		return this;
	}
	setDimensions(width, height) {
		__classPrivateFieldSet$3(this, _width, width);
		__classPrivateFieldSet$3(this, _height, height);
		switch (__classPrivateFieldGet$3(this, _projectionType)) {
			case ProjectionType.Orthographic:
				__classPrivateFieldSet$3(
					this,
					_projection,
					Matrix4.createOrthographic(
						__classPrivateFieldGet$3(this, _width),
						__classPrivateFieldGet$3(this, _height),
						__classPrivateFieldGet$3(this, _near),
						__classPrivateFieldGet$3(this, _far)
					)
				);
				break;
			case ProjectionType.Perspective:
				__classPrivateFieldSet$3(
					this,
					_projection,
					Matrix4.createPerspective(
						__classPrivateFieldGet$3(this, _width),
						__classPrivateFieldGet$3(this, _height),
						__classPrivateFieldGet$3(this, _near),
						__classPrivateFieldGet$3(this, _far)
					)
				);
				break;
		}
		__classPrivateFieldSet$3(
			this,
			_wvp,
			_createWVP(
				__classPrivateFieldGet$3(this, _world),
				__classPrivateFieldGet$3(this, _view),
				__classPrivateFieldGet$3(this, _projection)
			)
		);
		return this;
	}
	setPosition(x, y, z) {
		__classPrivateFieldGet$3(this, _position).x = x;
		__classPrivateFieldGet$3(this, _position).y = y;
		__classPrivateFieldGet$3(this, _position).z = z;
		__classPrivateFieldSet$3(
			this,
			_view,
			Matrix4.createLookAt(
				__classPrivateFieldGet$3(this, _position),
				__classPrivateFieldGet$3(this, _target),
				__classPrivateFieldGet$3(this, _up)
			)
		);
		__classPrivateFieldSet$3(
			this,
			_wvp,
			_createWVP(
				__classPrivateFieldGet$3(this, _world),
				__classPrivateFieldGet$3(this, _view),
				__classPrivateFieldGet$3(this, _projection)
			)
		);
		return this;
	}
	setTarget(x, y, z) {
		__classPrivateFieldGet$3(this, _target).x = x;
		__classPrivateFieldGet$3(this, _target).y = y;
		__classPrivateFieldGet$3(this, _target).z = z;
		__classPrivateFieldSet$3(
			this,
			_view,
			Matrix4.createLookAt(
				__classPrivateFieldGet$3(this, _position),
				__classPrivateFieldGet$3(this, _target),
				__classPrivateFieldGet$3(this, _up)
			)
		);
		__classPrivateFieldSet$3(
			this,
			_wvp,
			_createWVP(
				__classPrivateFieldGet$3(this, _world),
				__classPrivateFieldGet$3(this, _view),
				__classPrivateFieldGet$3(this, _projection)
			)
		);
		return this;
	}
	setUp(x, y, z) {
		__classPrivateFieldGet$3(this, _up).x = x;
		__classPrivateFieldGet$3(this, _up).y = y;
		__classPrivateFieldGet$3(this, _up).z = z;
		__classPrivateFieldSet$3(
			this,
			_view,
			Matrix4.createLookAt(
				__classPrivateFieldGet$3(this, _position),
				__classPrivateFieldGet$3(this, _target),
				__classPrivateFieldGet$3(this, _up)
			)
		);
		__classPrivateFieldSet$3(
			this,
			_wvp,
			_createWVP(
				__classPrivateFieldGet$3(this, _world),
				__classPrivateFieldGet$3(this, _view),
				__classPrivateFieldGet$3(this, _projection)
			)
		);
		return this;
	}
	setWorld(transform) {
		__classPrivateFieldSet$3(this, _world, transform);
		__classPrivateFieldSet$3(
			this,
			_wvp,
			_createWVP(
				__classPrivateFieldGet$3(this, _world),
				__classPrivateFieldGet$3(this, _view),
				__classPrivateFieldGet$3(this, _projection)
			)
		);
		return this;
	}
}
(_target = new WeakMap()),
	(_position = new WeakMap()),
	(_up = new WeakMap()),
	(_near = new WeakMap()),
	(_far = new WeakMap()),
	(_width = new WeakMap()),
	(_height = new WeakMap()),
	(_projectionType = new WeakMap()),
	(_world = new WeakMap()),
	(_view = new WeakMap()),
	(_projection = new WeakMap()),
	(_wvp = new WeakMap());

class Scene {
	constructor(name, theater) {
		this.name = name;
		this.theater = theater;
		Object.defineProperty(this, "name", {
			writable: false,
		});
		Object.defineProperty(this, "theater", {
			writable: false,
		});
	}
	onEnter() {}
	onExit() {}
}

class AttributeElement {
	constructor(name, size, type) {
		this.name = name;
		this.size = size;
		this.type = type;
		this.stride = -1;
		this.offset = -1;
		Object.defineProperty(this, "name", {
			writable: false,
		});
		Object.defineProperty(this, "size", {
			writable: false,
		});
		Object.defineProperty(this, "type", {
			writable: false,
		});
	}
}

const ATTRIBUTE_TYPES = {
	BYTE: 5120,
	SHORT: 5122,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123,
	FIXED: undefined,
	FLOAT: 5126,
};
Object.freeze(ATTRIBUTE_TYPES);

const ATTRIBUTE_SIZES = {
	BYTE: 1,
	SHORT: 2,
	UNSIGNED_BYTE: 1,
	UNSIGNED_SHORT: 2,
	FIXED: undefined,
	FLOAT: 4,
};
Object.freeze(ATTRIBUTE_SIZES);

function _processAttributeElements(elements) {
	let size = 0;
	let stride = 0;
	// Calculate total size and stride of all attribute elements.
	let strideOffsets = [];
	for (let element of elements) {
		size += element.size;
		strideOffsets.push(stride);
		switch (element.type) {
			case ATTRIBUTE_TYPES.FLOAT:
				stride += ATTRIBUTE_SIZES.FLOAT * element.size;
				break;
			default:
				throw new TypeError("Unsupported attribute type.");
		}
	}
	// Update each element to reflect the schema's stride.
	for (let i = 0; i < elements.length; i++) {
		elements[i].stride = stride;
		elements[i].offset = strideOffsets[i];
	}
	return {
		size: size,
		stride: stride,
	};
}
class AttributeSchema {
	constructor(elements) {
		this.elements = elements;
		const result = _processAttributeElements(this.elements);
		this.size = result.size;
		this.stride = result.stride;
		Object.defineProperty(this, "elements", {
			writable: false,
		});
		Object.defineProperty(this, "size", {
			writable: false,
		});
		Object.defineProperty(this, "stride", {
			writable: false,
		});
	}
}

//#region Public
function getWebGLContext(canvas) {
	const gl = canvas.getContext("webgl");
	if (gl === null) {
		throw new Error("WebGL is not supported on this device.");
	}
	return gl;
}
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
	const vertexShader = _createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = _createShader(
		gl,
		gl.FRAGMENT_SHADER,
		fragmentShaderSource
	);
	return _createProgram(gl, vertexShader, fragmentShader);
}
function allocateVertexBuffer(gl, size, usage) {
	return _allocateBuffer(gl, gl.ARRAY_BUFFER, size, usage);
}
function setVertexBufferData(gl, buffer, data) {
	_setBufferData(gl, gl.ARRAY_BUFFER, buffer, data);
}
function allocateIndexBuffer(gl, size) {
	return _allocateBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, size, gl.STATIC_DRAW);
}
function setIndexBufferData(gl, buffer, data) {
	_setBufferData(gl, gl.ELEMENT_ARRAY_BUFFER, buffer, data);
}
async function loadImage(url) {
	return new Promise((resolve, reject) => {
		try {
			const image = new Image();
			image.onload = () => {
				resolve(image);
			};
			image.src = url;
		} catch (error) {
			reject(error);
		}
	});
}
function createTexture2D(gl, width, height, pixels) {
	const texture = gl.createTexture();
	if (texture === null) {
		throw new Error("Something went wrong; could not create WebGLTexture.");
	}
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		width,
		height,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		pixels
	);
	if (_isPowerOfTwo(width) && _isPowerOfTwo(height)) {
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	}
	return texture;
}
function createTexture2DFromImage(gl, image) {
	const texture = gl.createTexture();
	if (texture === null) {
		throw new Error("Something went wrong; could not create WebGLTexture.");
	}
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	if (_isPowerOfTwo(image.width) && _isPowerOfTwo(image.height)) {
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	}
	return texture;
}
// * At this point, this is really just my default OpenGL settings ._.
function enablePremultipliedAlpha(gl) {
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.clearDepth(1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
}
function clear(gl, r, g, b, a) {
	gl.clearColor(r, g, b, a);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
//#endregion
//#region Private
function _allocateBuffer(gl, target, size, usage) {
	const buffer = gl.createBuffer();
	if (buffer === null) {
		throw new Error("Something went wrong; could not create WebGLBuffer.");
	}
	gl.bindBuffer(target, buffer);
	gl.bufferData(target, size, usage);
	return buffer;
}
function _setBufferData(gl, target, buffer, data) {
	gl.bindBuffer(target, buffer);
	gl.bufferSubData(target, 0, data);
}
function _createShader(gl, type, source) {
	const shader = gl.createShader(type);
	if (shader === null) {
		throw new TypeError(`'${type}' is not a valid WebGL shader type.`);
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const error = new Error(
			`An error occurred will compiling the shader: ${gl.getShaderInfoLog(
				shader
			)}`
		);
		gl.deleteShader(shader);
		throw error;
	}
	return shader;
}
function _createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	if (program === null) {
		throw new Error("Something went wrong; could not create WebGLProgram.");
	}
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(
			`An error occurred while initializing the shader program: ${gl.getProgramInfoLog(
				program
			)}`
		);
	}
	return program;
}
function _isPowerOfTwo(value) {
	return (value & (value - 1)) === 0;
}
//#endregion

const BUFFER_TYPES = {
	VERTEX: 0,
	INDEX: 1,
};
Object.freeze(BUFFER_TYPES);

var __classPrivateFieldSet$4 =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$4 =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _graphics;
class Buffer {
	constructor(graphics, length, type) {
		_graphics.set(this, void 0);
		this.length = length;
		this.type = type;
		__classPrivateFieldSet$4(this, _graphics, graphics);
		this.data = null;
		this.buffer = null;
		Object.defineProperty(this, "length", {
			writable: false,
		});
		Object.defineProperty(this, "type", {
			writable: false,
		});
	}
	setData(data) {
		if (this.data === null || this.buffer === null) {
			throw new Error(
				"This buffer was not initialized correctly. Make sure the 'data' and 'buffer' properties are set.."
			);
		}
		// Do not bother doing anything if the data parameter doesn't exist.
		if (data === undefined || data === null) {
			return;
		}
		if (data.length > this.length) {
			throw new TypeError(
				`Expected an array with ${this.length} element(s) or less.`
			);
		}
		this.data.set(data);
		switch (this.type) {
			case BUFFER_TYPES.VERTEX: {
				setVertexBufferData(
					__classPrivateFieldGet$4(this, _graphics).gl,
					this.buffer,
					this.data
				);
				break;
			}
			case BUFFER_TYPES.INDEX: {
				setIndexBufferData(
					__classPrivateFieldGet$4(this, _graphics).gl,
					this.buffer,
					this.data
				);
				break;
			}
			default: {
				throw new TypeError(`'${this.type}' is an invalid BufferType.`);
			}
		}
	}
}
_graphics = new WeakMap();

var __classPrivateFieldSet$5 =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$5 =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _r, _g, _b, _a;
const _rgbStep = 1 / 255;
class Color {
	constructor(hex, a) {
		//#endregion
		_r.set(this, void 0);
		_g.set(this, void 0);
		_b.set(this, void 0);
		_a.set(this, void 0);
		__classPrivateFieldSet$5(this, _r, 0);
		__classPrivateFieldSet$5(this, _g, 0);
		__classPrivateFieldSet$5(this, _b, 0);
		__classPrivateFieldSet$5(this, _a, 1);
		switch (typeof hex) {
			case "number": {
				__classPrivateFieldSet$5(
					this,
					_r,
					this.validateValue(((hex & 0xff0000) >> 16) / 255)
				);
				__classPrivateFieldSet$5(
					this,
					_g,
					this.validateValue(((hex & 0xff00) >> 8) / 255)
				);
				__classPrivateFieldSet$5(
					this,
					_b,
					this.validateValue((hex & 0xff) / 255)
				);
				break;
			}
			case "string": {
				let formatted = hex.toLowerCase().trim();
				formatted =
					formatted.substring(0, 1) == "#" ? formatted.substring(1) : formatted;
				if (!/^[\da-f]{6}$/.test(formatted))
					throw new TypeError(
						"The given string could not be parsed as a hexadecimal value."
					);
				const hexAsNumber = parseInt(formatted, 16);
				__classPrivateFieldSet$5(
					this,
					_r,
					this.validateValue(((hexAsNumber & 0xff0000) >> 16) / 255)
				);
				__classPrivateFieldSet$5(
					this,
					_g,
					this.validateValue(((hexAsNumber & 0xff00) >> 8) / 255)
				);
				__classPrivateFieldSet$5(
					this,
					_b,
					this.validateValue((hexAsNumber & 0xff) / 255)
				);
				break;
			}
		}
		if (a !== undefined) {
			this.multiply(this.validateValue(a));
		}
	}
	//#region Getters and Setters
	get r() {
		return __classPrivateFieldGet$5(this, _r);
	}
	set r(value) {
		__classPrivateFieldSet$5(this, _r, this.validateValue(value));
	}
	get g() {
		return __classPrivateFieldGet$5(this, _g);
	}
	set g(value) {
		__classPrivateFieldSet$5(this, _g, this.validateValue(value));
	}
	get b() {
		return __classPrivateFieldGet$5(this, _b);
	}
	set b(value) {
		__classPrivateFieldSet$5(this, _b, this.validateValue(value));
	}
	get a() {
		return __classPrivateFieldGet$5(this, _a);
	}
	set a(value) {
		__classPrivateFieldSet$5(this, _a, this.validateValue(value));
	}
	fromRGB(r, g, b, a) {
		__classPrivateFieldSet$5(this, _r, this.validateValue(r / 255));
		__classPrivateFieldSet$5(this, _g, this.validateValue(g / 255));
		__classPrivateFieldSet$5(this, _b, this.validateValue(b / 255));
		if (a !== undefined) {
			this.multiply(this.validateValue(a));
		}
		return this;
	}
	multiply(value) {
		__classPrivateFieldSet$5(
			this,
			_r,
			this.validateValue(__classPrivateFieldGet$5(this, _r) * value)
		);
		__classPrivateFieldSet$5(
			this,
			_g,
			this.validateValue(__classPrivateFieldGet$5(this, _g) * value)
		);
		__classPrivateFieldSet$5(
			this,
			_b,
			this.validateValue(__classPrivateFieldGet$5(this, _b) * value)
		);
		__classPrivateFieldSet$5(
			this,
			_a,
			this.validateValue(__classPrivateFieldGet$5(this, _a) * value)
		);
	}
	toArray() {
		return [
			__classPrivateFieldGet$5(this, _r),
			__classPrivateFieldGet$5(this, _g),
			__classPrivateFieldGet$5(this, _b),
			__classPrivateFieldGet$5(this, _a),
		];
	}
	toString() {
		const rAsRGB = Math.floor(__classPrivateFieldGet$5(this, _r) * 255);
		const gAsRGB = Math.floor(__classPrivateFieldGet$5(this, _g) * 255);
		const bAsRGB = Math.floor(__classPrivateFieldGet$5(this, _b) * 255);
		let rString = rAsRGB.toString(16);
		if (rString.length === 1) {
			rString = `0${rString}`;
		}
		let gString = gAsRGB.toString(16);
		if (gString.length === 1) {
			gString = `0${gString}`;
		}
		let bString = bAsRGB.toString(16);
		if (bString.length === 1) {
			bString = `0${bString}`;
		}
		return `(${rAsRGB} ${gAsRGB} ${bAsRGB}) ${__classPrivateFieldGet$5(
			this,
			_a
		).toFixed(4)}, 0x${rString}${gString}${bString}`;
	}
	validateValue(value) {
		if (value < _rgbStep) {
			return 0;
		}
		if (value > 1) {
			return 1;
		}
		return Math.floor(value / _rgbStep) * _rgbStep;
	}
}
(_r = new WeakMap()),
	(_g = new WeakMap()),
	(_b = new WeakMap()),
	(_a = new WeakMap());

const DRAW_MODES = {
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
};
Object.freeze(DRAW_MODES);

class Effect {
	constructor(graphics, vertexShaderSource, fragmentShaderSource) {
		this.program = createProgram(
			graphics.gl,
			vertexShaderSource,
			fragmentShaderSource
		);
		Object.defineProperty(this, "program", {
			writable: false,
		});
	}
}

var __classPrivateFieldSet$6 =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$6 =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _currentProgram, _drawWidth, _drawHeight, _scale;
class Graphics {
	constructor(gl) {
		_currentProgram.set(this, void 0);
		_drawWidth.set(this, void 0);
		_drawHeight.set(this, void 0);
		_scale.set(this, void 0);
		this.gl = gl;
		this.extensions = {
			ANGLE_instanced_arrays: this.gl.getExtension("ANGLE_instanced_arrays"),
		};
		__classPrivateFieldSet$6(this, _currentProgram, null);
		__classPrivateFieldSet$6(this, _drawWidth, -1);
		__classPrivateFieldSet$6(this, _drawHeight, -1);
		__classPrivateFieldSet$6(this, _scale, -1);
		enablePremultipliedAlpha(this.gl);
		Object.defineProperty(this, "gl", {
			writable: false,
		});
		Object.defineProperty(this, "extensions", {
			writable: false,
		});
	}
	get drawWidth() {
		return __classPrivateFieldGet$6(this, _drawWidth);
	}
	get drawHeight() {
		return __classPrivateFieldGet$6(this, _drawHeight);
	}
	get scale() {
		return __classPrivateFieldGet$6(this, _scale);
	}
	get isLandscape() {
		return (
			__classPrivateFieldGet$6(this, _drawWidth) >=
			__classPrivateFieldGet$6(this, _drawHeight)
		);
	}
	setCanvasDimensions(width, height) {
		this.gl.canvas.width = width;
		this.gl.canvas.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		// I do not trust that people will read the README, so if the resolution has not been set
		// yet then just set the resolution to the canvas' dimensions.
		if (__classPrivateFieldGet$6(this, _drawWidth) < 0) {
			this.setResolution(width, height);
		}
		return this;
	}
	setResolution(width, height) {
		__classPrivateFieldSet$6(this, _drawWidth, Math.max(0, width));
		__classPrivateFieldSet$6(this, _drawHeight, Math.max(0, height));
		if (this.isLandscape) {
			__classPrivateFieldSet$6(
				this,
				_scale,
				this.gl.canvas.height / __classPrivateFieldGet$6(this, _drawHeight)
			);
			// Check if pillar boxing is required.
			if (
				__classPrivateFieldGet$6(this, _drawWidth) *
					__classPrivateFieldGet$6(this, _scale) >
				this.gl.canvas.width
			) {
				__classPrivateFieldSet$6(
					this,
					_scale,
					this.gl.canvas.width / __classPrivateFieldGet$6(this, _drawWidth)
				);
			}
		} else {
			__classPrivateFieldSet$6(
				this,
				_scale,
				this.gl.canvas.width / __classPrivateFieldGet$6(this, _drawWidth)
			);
			// Check if letter boxing is required.
			if (
				__classPrivateFieldGet$6(this, _drawHeight) *
					__classPrivateFieldGet$6(this, _scale) >
				this.gl.canvas.height
			) {
				__classPrivateFieldSet$6(
					this,
					_scale,
					this.gl.canvas.width / __classPrivateFieldGet$6(this, _drawWidth)
				);
			}
		}
		return this;
	}
	clear(color) {
		clear(this.gl, color.r, color.g, color.b, color.a);
	}
	begin(effect) {
		__classPrivateFieldSet$6(this, _currentProgram, effect.program);
		this.gl.useProgram(__classPrivateFieldGet$6(this, _currentProgram));
		return this;
	}
	setVertexBuffer(...buffers) {
		if (__classPrivateFieldGet$6(this, _currentProgram) === null) {
			throw new Error(
				"'begin(effect)' must be called before setting a VertexBuffer."
			);
		}
		for (let i = 0; i < buffers.length; i++) {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers[i].buffer);
			for (let element of buffers[i].attributeSchema.elements) {
				const index = this.gl.getAttribLocation(
					__classPrivateFieldGet$6(this, _currentProgram),
					element.name
				);
				if (index < 0) {
					throw new Error(
						`The current program does not have a(n) '${element.name}' attribute.`
					);
				}
				this.gl.enableVertexAttribArray(index);
				this.gl.vertexAttribPointer(
					index,
					element.size,
					element.type,
					false,
					element.stride,
					element.offset
				);
				this.extensions["ANGLE_instanced_arrays"].vertexAttribDivisorANGLE(
					index,
					buffers[i].instanceFrequency
				);
			}
		}
		return this;
	}
	setIndexBuffer(buffer) {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer.buffer);
		return this;
	}
	// ! This literally only works for setting the wvp matrix... 😞
	// TODO: implement like a giant switch for all possible uniforms???
	setUniform(uniform, value) {
		if (__classPrivateFieldGet$6(this, _currentProgram) === null) {
			throw new Error(
				"'begin(effect)' must be called before setting a uniform."
			);
		}
		const location = this.gl.getUniformLocation(
			__classPrivateFieldGet$6(this, _currentProgram),
			uniform
		);
		this.gl.uniformMatrix4fv(location, false, value);
		return this;
	}
	setUniform2(uniform) {
		if (__classPrivateFieldGet$6(this, _currentProgram) === null) {
			throw new Error("'begin(effect)' must be called before setting a NULL.");
		}
		const location = this.gl.getUniformLocation(
			__classPrivateFieldGet$6(this, _currentProgram),
			uniform
		);
		this.gl.uniform1i(location, 0);
		return this;
	}
	setTexture(texture) {
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
		return this;
	}
	drawArrays(mode, offset, primitiveCount) {
		this.gl.drawArrays(mode, offset, primitiveCount);
		return this;
	}
	drawElements(mode, totalTriangles, offset) {
		this.gl.drawElements(
			mode,
			totalTriangles * 3,
			this.gl.UNSIGNED_SHORT,
			offset
		);
		return this;
	}
	drawInstancedElements(mode, totalTriangles, offset, primitiveCount) {
		this.extensions["ANGLE_instanced_arrays"].drawElementsInstancedANGLE(
			mode,
			totalTriangles * 3,
			this.gl.UNSIGNED_SHORT,
			offset,
			primitiveCount
		);
		return this;
	}
	// ? I am not sure if you ever really need to do this, but the method is here if you want.
	disableVertexBuffer(...buffers) {
		if (__classPrivateFieldGet$6(this, _currentProgram) === null) {
			throw new Error(
				"'begin(effect)' must be called before deleting a Buffer."
			);
		}
		for (let i = 0; i < buffers.length; i++) {
			for (let element of buffers[i].attributeSchema.elements) {
				const index = this.gl.getAttribLocation(
					__classPrivateFieldGet$6(this, _currentProgram),
					element.name
				);
				if (index < 0) {
					throw new Error(
						`The current program does not have a(n) '${element.name}' attribute.`
					);
				}
				this.gl.disableVertexAttribArray(index);
			}
		}
		return this;
	}
	end() {
		__classPrivateFieldSet$6(this, _currentProgram, null);
	}
}
(_currentProgram = new WeakMap()),
	(_drawWidth = new WeakMap()),
	(_drawHeight = new WeakMap()),
	(_scale = new WeakMap());

class IndexBuffer extends Buffer {
	constructor(graphics, length) {
		super(graphics, length, BUFFER_TYPES.INDEX);
		this.data = new Int16Array(this.length);
		this.buffer = allocateIndexBuffer(graphics.gl, this.data.byteLength);
	}
}

class Mesh {
	constructor(vertices, indices) {
		this.vertices = vertices;
		this.indices = indices;
		// Should i force the end user to use vertices with 3 parts?? How can i get around this!
		this.totalVertices = vertices.length / 3;
		this.totalIndices = indices.length;
		Object.defineProperty(this, "vertices", {
			writable: false,
		});
		Object.defineProperty(this, "indices", {
			writable: false,
		});
		Object.defineProperty(this, "totalVertices", {
			writable: false,
		});
		Object.defineProperty(this, "totalIndices", {
			writable: false,
		});
	}
}

var __classPrivateFieldSet$7 =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$7 =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _width$1, _height$1, _data$2;
class Texture2D {
	constructor(width, height) {
		_width$1.set(this, void 0);
		_height$1.set(this, void 0);
		_data$2.set(this, void 0);
		__classPrivateFieldSet$7(this, _width$1, 0);
		__classPrivateFieldSet$7(this, _height$1, 0);
		__classPrivateFieldSet$7(this, _data$2, null);
		if (width !== undefined) {
			__classPrivateFieldSet$7(this, _width$1, width);
		}
		if (height !== undefined) {
			__classPrivateFieldSet$7(this, _height$1, height);
		}
	}
	get width() {
		return __classPrivateFieldGet$7(this, _width$1);
	}
	get height() {
		return __classPrivateFieldGet$7(this, _height$1);
	}
	get data() {
		return __classPrivateFieldGet$7(this, _data$2);
	}
	setPixels(graphics, pixels) {
		__classPrivateFieldSet$7(
			this,
			_data$2,
			createTexture2D(
				graphics.gl,
				__classPrivateFieldGet$7(this, _width$1),
				this.height,
				pixels
			)
		);
	}
	static async fromURL(graphics, url) {
		const image = await loadImage(url);
		const data = createTexture2DFromImage(graphics.gl, image);
		const texture = new Texture2D(image.width, image.height);
		__classPrivateFieldSet$7(texture, _data$2, data);
		return texture;
	}
}
(_width$1 = new WeakMap()), (_height$1 = new WeakMap()), (_data$2 = new WeakMap());

class VertexBuffer extends Buffer {
	constructor(
		graphics,
		attributeSchema,
		length,
		vertexUsage,
		instanceFrequency
	) {
		super(graphics, length, BUFFER_TYPES.VERTEX);
		this.attributeSchema = attributeSchema;
		this.vertexUsage = vertexUsage;
		this.instanceFrequency = instanceFrequency ? instanceFrequency : 0;
		this.data = new Float32Array(this.length);
		this.buffer = allocateVertexBuffer(
			graphics.gl,
			this.data.byteLength,
			this.vertexUsage
		);
		Object.defineProperty(this, "attributeSchema", {
			writable: false,
		});
		Object.defineProperty(this, "vertexUsage", {
			writable: false,
		});
		Object.defineProperty(this, "instanceFrequency", {
			writable: false,
		});
	}
}

const VERTEX_USAGE = {
	STREAM: 35040,
	STATIC: 35044,
	DYNAMIC: 35048,
};
Object.freeze(VERTEX_USAGE);

class GamepadState {
	constructor(gamepad) {
		this.gamepad = gamepad;
		Object.defineProperty(this, "gamepad", {
			writable: false,
		});
	}
}

const _gamepads = new Map();
const _xinputButtonMap = new Map();
_xinputButtonMap.set("a", 0);
_xinputButtonMap.set("b", 1);
_xinputButtonMap.set("x", 2);
_xinputButtonMap.set("y", 3);
_xinputButtonMap.set("leftbumper", 4);
_xinputButtonMap.set("rightbumper", 5);
_xinputButtonMap.set("lefttrigger", 6);
_xinputButtonMap.set("righttrigger", 7);
_xinputButtonMap.set("back", 8);
_xinputButtonMap.set("start", 9);
_xinputButtonMap.set("leftstick", 10);
_xinputButtonMap.set("rightstick", 11);
_xinputButtonMap.set("dpadup", 12);
_xinputButtonMap.set("dpaddown", 13);
_xinputButtonMap.set("dpadleft", 14);
_xinputButtonMap.set("dpadright", 15);
//@ts-ignore
window.addEventListener("gamepadconnected", (event) => {
	_gamepads.set(event.gamepad.index, event.gamepad);
});
//@ts-ignore
window.addEventListener("gamepaddisconnected", (event) => {
	_gamepads.delete(event.gamepad.index);
});
/**
 * Returns the current state of a specific gamepad.
 * @param playerIndex The index of the target gamepad.
 */
function getState(playerIndex) {
	if (!_gamepads.has(playerIndex)) {
		return null;
	}
	//@ts-ignore
	return new GamepadState(_gamepads.get(playerIndex));
}
/**
 * Returns whether or not a given button is pressed on a gamepad.
 * @param button A single gamepad button, or multiple comma separated gamepad buttons (e.g. A, DPadUp, LeftTrigger, etc.).
 * @param gamepadState The current GamepadState to test against.
 */
function isButtonDown(button, gamepadState) {
	// Format and separate "button" parameter into individual strings;
	const seperatedButtons = button.toLocaleLowerCase().split(",");
	for (let i = 0; i < seperatedButtons.length; i++) {
		const formattedButton = seperatedButtons[i].trim();
		// Check if a formatted button is included in the xinput mappings.
		if (_xinputButtonMap.has(formattedButton)) {
			// Get the appropriate index of the button.
			const buttonValue = _xinputButtonMap.get(formattedButton);
			if (
				//@ts-ignore
				gamepadState.gamepad.buttons[buttonValue].pressed &&
				//@ts-ignore
				gamepadState.gamepad.buttons[buttonValue].value > 0
			) {
				return true;
			}
		}
	}
	return false;
}

class KeyboardState {
	constructor(event, keysPressed) {
		this.event = event;
		this.keysPressed = new Set(keysPressed);
		Object.defineProperty(this, "event", {
			writable: false,
		});
		Object.defineProperty(this, "keysPressed", {
			writable: false,
		});
	}
}

const _keysPressed = new Set();
let _lastEvent = null;
window.addEventListener("keydown", (event) => {
	_lastEvent = event;
	if (event.repeat) {
		return;
	}
	_keysPressed.add(event.key.toLocaleLowerCase());
});
window.addEventListener("keyup", (event) => {
	_lastEvent = event;
	_keysPressed.delete(event.key.toLocaleLowerCase());
});
window.addEventListener("blur", () => {
	_lastEvent = null;
	_keysPressed.clear();
});
/**
 * Returns the current state of the keyboard.
 */
function getState$1() {
	if (_lastEvent === null) {
		return null;
	}
	return new KeyboardState(_lastEvent, _keysPressed);
}
/**
 * Returns whether or not a given key is pressed on the keyboard.
 * @param key A single key, or multiple comma separated keys (e.g. s, m, shift, etc.).
 * @param keyboardState The current KeyboardState to test against.
 */
function isKeyDown(key, keyboardState) {
	// Format and separate "key" parameter into individual strings;
	const seperatedKeys = key.toLocaleLowerCase().split(",");
	for (let i = 0; i < seperatedKeys.length; i++) {
		if (keyboardState.keysPressed.has(seperatedKeys[i].trim())) {
			return true;
		}
	}
	return false;
}

var __classPrivateFieldSet$8 =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$8 =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _previousKeyState, _currentKeyState;
class SmartKeyboard {
	constructor() {
		_previousKeyState.set(this, void 0);
		_currentKeyState.set(this, void 0);
		__classPrivateFieldSet$8(this, _previousKeyState, null);
		__classPrivateFieldSet$8(this, _currentKeyState, null);
	}
	pressed(key) {
		if (
			__classPrivateFieldGet$8(this, _previousKeyState) === null ||
			__classPrivateFieldGet$8(this, _currentKeyState) === null
		) {
			return false;
		}
		return (
			!isKeyDown(
				key,
				__classPrivateFieldGet$8(this, _previousKeyState)
			) &&
			isKeyDown(
				key,
				__classPrivateFieldGet$8(this, _currentKeyState)
			)
		);
	}
	pressing(key) {
		if (__classPrivateFieldGet$8(this, _currentKeyState) === null) {
			return false;
		}
		return isKeyDown(
			key,
			__classPrivateFieldGet$8(this, _currentKeyState)
		);
	}
	update() {
		__classPrivateFieldSet$8(
			this,
			_previousKeyState,
			__classPrivateFieldGet$8(this, _currentKeyState)
		);
		__classPrivateFieldSet$8(this, _currentKeyState, getState$1());
	}
}
(_previousKeyState = new WeakMap()), (_currentKeyState = new WeakMap());

var __classPrivateFieldSet$9 =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$9 =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _previousGamepadState, _currentGamepadState;
class SmartGamepad {
	constructor(playerIndex) {
		_previousGamepadState.set(this, void 0);
		_currentGamepadState.set(this, void 0);
		this.playerIndex = playerIndex;
		__classPrivateFieldSet$9(this, _previousGamepadState, null);
		__classPrivateFieldSet$9(this, _currentGamepadState, null);
		Object.defineProperty(this, "playerIndex", {
			writable: false,
		});
	}
	get connected() {
		return __classPrivateFieldGet$9(this, _currentGamepadState) !== null;
	}
	get description() {
		if (__classPrivateFieldGet$9(this, _currentGamepadState) === null) {
			return "";
		}
		return __classPrivateFieldGet$9(this, _currentGamepadState).gamepad.id;
	}
	get leftStickAxes() {
		if (__classPrivateFieldGet$9(this, _currentGamepadState) === null) {
			return {
				x: 0,
				y: 0,
			};
		}
		return {
			x: __classPrivateFieldGet$9(this, _currentGamepadState).gamepad.axes[0],
			y: -__classPrivateFieldGet$9(this, _currentGamepadState).gamepad.axes[1],
		};
	}
	get rightStickAxes() {
		if (__classPrivateFieldGet$9(this, _currentGamepadState) === null) {
			return {
				x: 0,
				y: 0,
			};
		}
		return {
			x: __classPrivateFieldGet$9(this, _currentGamepadState).gamepad.axes[2],
			y: -__classPrivateFieldGet$9(this, _currentGamepadState).gamepad.axes[3],
		};
	}
	get buttons() {
		if (__classPrivateFieldGet$9(this, _currentGamepadState) === null) {
			return [];
		}
		return __classPrivateFieldGet$9(this, _currentGamepadState).gamepad.axes;
	}
	pressed(button) {
		if (
			__classPrivateFieldGet$9(this, _previousGamepadState) === null ||
			__classPrivateFieldGet$9(this, _currentGamepadState) === null
		) {
			return false;
		}
		return (
			!isButtonDown(
				button,
				__classPrivateFieldGet$9(this, _previousGamepadState)
			) &&
			isButtonDown(
				button,
				__classPrivateFieldGet$9(this, _currentGamepadState)
			)
		);
	}
	pressing(button) {
		if (__classPrivateFieldGet$9(this, _currentGamepadState) === null) {
			return false;
		}
		return isButtonDown(
			button,
			__classPrivateFieldGet$9(this, _currentGamepadState)
		);
	}
	update() {
		__classPrivateFieldSet$9(
			this,
			_previousGamepadState,
			__classPrivateFieldGet$9(this, _currentGamepadState)
		);
		__classPrivateFieldSet$9(
			this,
			_currentGamepadState,
			getState(this.playerIndex)
		);
	}
}
(_previousGamepadState = new WeakMap()), (_currentGamepadState = new WeakMap());

class PointerState {
	constructor(event) {
		this.event = event;
		Object.defineProperty(this, "event", {
			writable: false,
		});
	}
}

let _lastEvent$1 = null;
window.addEventListener("pointermove", (event) => {
	_lastEvent$1 = event;
});
window.addEventListener("pointerdown", (event) => {
	_lastEvent$1 = event;
});
window.addEventListener("pointerup", (event) => {
	_lastEvent$1 = event;
});
window.addEventListener("blur", () => {
	_lastEvent$1 = null;
});
/**
 * Returns the current state of the current pointer.
 */
function getState$2() {
	if (_lastEvent$1 === null) {
		return null;
	}
	return new PointerState(_lastEvent$1);
}
/**
 * Returns whether or not a given button is pressed on the mouse.
 * @param button A single mouse button, or multiple comma separated mouse buttons (e.g. leftclick, rightclick, etc.).
 * @param pointerState The current PointerState to test against.
 */
function isButtonDown$1(button, pointerState) {
	// Format and separate "button" parameter into individual strings;
	const formattedButtons = button.toLocaleLowerCase().split(",");
	// Duplicate button strings would break this method, so get rid of them!
	const formattedButtonsSet = new Set(formattedButtons);
	// Compute the cumulative value of all entries in formatedButtonsSet.
	let computedButtons = 0;
	for (let entry of formattedButtonsSet) {
		switch (entry.trim()) {
			case "leftclick":
				computedButtons += 1;
				break;
			case "rightclick":
				computedButtons += 2;
				break;
			case "middleclick":
				computedButtons += 4;
				break;
		}
	}
	return (pointerState.event.buttons & computedButtons) !== 0;
}

var __classPrivateFieldSet$a =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$a =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _element, _previousPointerState, _currentPointerState, _x, _y;
class SmartPointer {
	constructor() {
		_element.set(this, void 0);
		_previousPointerState.set(this, void 0);
		_currentPointerState.set(this, void 0);
		_x.set(this, void 0);
		_y.set(this, void 0);
		__classPrivateFieldSet$a(this, _element, null);
		__classPrivateFieldSet$a(this, _previousPointerState, null);
		__classPrivateFieldSet$a(this, _currentPointerState, null);
		__classPrivateFieldSet$a(this, _x, 0);
		__classPrivateFieldSet$a(this, _y, 0);
	}
	get x() {
		return __classPrivateFieldGet$a(this, _x);
	}
	get y() {
		return __classPrivateFieldGet$a(this, _y);
	}
	attachElement(element) {
		__classPrivateFieldSet$a(this, _element, element);
	}
	pressed(button) {
		if (
			__classPrivateFieldGet$a(this, _previousPointerState) === null ||
			__classPrivateFieldGet$a(this, _currentPointerState) === null
		) {
			return false;
		}
		return (
			!isButtonDown$1(
				button,
				__classPrivateFieldGet$a(this, _previousPointerState)
			) &&
			isButtonDown$1(
				button,
				__classPrivateFieldGet$a(this, _currentPointerState)
			)
		);
	}
	pressing(button) {
		if (__classPrivateFieldGet$a(this, _currentPointerState) === null) {
			return false;
		}
		return isButtonDown$1(
			button,
			__classPrivateFieldGet$a(this, _currentPointerState)
		);
	}
	update() {
		__classPrivateFieldSet$a(
			this,
			_previousPointerState,
			__classPrivateFieldGet$a(this, _currentPointerState)
		);
		__classPrivateFieldSet$a(this, _currentPointerState, getState$2());
		if (
			__classPrivateFieldGet$a(this, _element) !== null &&
			__classPrivateFieldGet$a(this, _currentPointerState) !== null
		) {
			__classPrivateFieldSet$a(
				this,
				_x,
				__classPrivateFieldGet$a(this, _currentPointerState).event.clientX -
					__classPrivateFieldGet$a(this, _element).offsetLeft
			);
			__classPrivateFieldSet$a(
				this,
				_y,
				__classPrivateFieldGet$a(this, _currentPointerState).event.clientY -
					__classPrivateFieldGet$a(this, _element).offsetTop
			);
		}
	}
}
(_element = new WeakMap()),
	(_previousPointerState = new WeakMap()),
	(_currentPointerState = new WeakMap()),
	(_x = new WeakMap()),
	(_y = new WeakMap());

var __classPrivateFieldSet$b =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$b =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _smartKeyboard, _smartPointer, _smartGamepad, _inputProfile, _inputMode;
class InputHandler {
	constructor(element, playerIndex) {
		_smartKeyboard.set(this, void 0);
		_smartPointer.set(this, void 0);
		_smartGamepad.set(this, void 0);
		_inputProfile.set(this, void 0);
		_inputMode.set(this, void 0);
		this.playerIndex = playerIndex;
		__classPrivateFieldSet$b(this, _smartKeyboard, new SmartKeyboard());
		__classPrivateFieldSet$b(this, _smartPointer, new SmartPointer());
		__classPrivateFieldSet$b(this, _smartGamepad, new SmartGamepad(playerIndex));
		__classPrivateFieldSet$b(this, _inputProfile, null);
		__classPrivateFieldSet$b(this, _inputMode, "keyboard");
		__classPrivateFieldGet$b(this, _smartPointer).attachElement(element);
		Object.defineProperty(this, "playerIndex", {
			writable: false,
		});
	}
	get lastInputType() {
		return __classPrivateFieldGet$b(this, _inputMode);
	}
	get pointerPosition() {
		return {
			x: __classPrivateFieldGet$b(this, _smartPointer).x,
			y: __classPrivateFieldGet$b(this, _smartPointer).y,
		};
	}
	loadProfile(profile) {
		__classPrivateFieldSet$b(this, _inputProfile, profile);
		return this;
	}
	pressed(name) {
		if (__classPrivateFieldGet$b(this, _inputProfile) === null) {
			throw new TypeError("An input profile has not been loaded yet.");
		}
		const inputMapping = __classPrivateFieldGet$b(this, _inputProfile).getMapping(
			name
		);
		if (inputMapping === undefined) {
			return false;
		}
		if (this.playerIndex === 0) {
			if (
				__classPrivateFieldGet$b(this, _smartKeyboard).pressed(
					inputMapping.keys
				) ||
				__classPrivateFieldGet$b(this, _smartPointer).pressed(
					inputMapping.mouseButtons
				)
			) {
				__classPrivateFieldSet$b(this, _inputMode, "keyboard");
				return true;
			}
		}
		if (__classPrivateFieldGet$b(this, _smartGamepad).connected) {
			if (
				__classPrivateFieldGet$b(this, _smartGamepad).pressed(
					inputMapping.gamepadButtons
				)
			) {
				__classPrivateFieldSet$b(this, _inputMode, "gamepad");
				return true;
			}
		}
		return false;
	}
	pressing(name) {
		if (__classPrivateFieldGet$b(this, _inputProfile) === null) {
			throw new TypeError("An input profile has not been loaded yet.");
		}
		const inputMapping = __classPrivateFieldGet$b(this, _inputProfile).getMapping(
			name
		);
		if (inputMapping === undefined) {
			return false;
		}
		if (this.playerIndex === 0) {
			if (
				__classPrivateFieldGet$b(this, _smartKeyboard).pressing(
					inputMapping.keys
				) ||
				__classPrivateFieldGet$b(this, _smartPointer).pressing(
					inputMapping.mouseButtons
				)
			) {
				__classPrivateFieldSet$b(this, _inputMode, "keyboard");
				return true;
			}
		}
		if (__classPrivateFieldGet$b(this, _smartGamepad).connected) {
			if (
				__classPrivateFieldGet$b(this, _smartGamepad).pressing(
					inputMapping.gamepadButtons
				)
			) {
				__classPrivateFieldSet$b(this, _inputMode, "gamepad");
				return true;
			}
		}
		return false;
	}
	update() {
		__classPrivateFieldGet$b(this, _smartKeyboard).update();
		__classPrivateFieldGet$b(this, _smartPointer).update();
		__classPrivateFieldGet$b(this, _smartGamepad).update();
	}
}
(_smartKeyboard = new WeakMap()),
	(_smartPointer = new WeakMap()),
	(_smartGamepad = new WeakMap()),
	(_inputProfile = new WeakMap()),
	(_inputMode = new WeakMap());

var __classPrivateFieldSet$c =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$c =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _keys, _gamepadButtons, _mouseButtons;
class InputMapping {
	constructor(name, keys, gamepadButtons, mouseButtons) {
		_keys.set(this, void 0);
		_gamepadButtons.set(this, void 0);
		_mouseButtons.set(this, void 0);
		this.name = name;
		__classPrivateFieldSet$c(this, _keys, "");
		__classPrivateFieldSet$c(this, _gamepadButtons, "");
		__classPrivateFieldSet$c(this, _mouseButtons, "");
		if (keys !== undefined) {
			__classPrivateFieldSet$c(this, _keys, keys);
		}
		if (gamepadButtons !== undefined) {
			__classPrivateFieldSet$c(this, _gamepadButtons, gamepadButtons);
		}
		if (mouseButtons !== undefined) {
			__classPrivateFieldSet$c(this, _mouseButtons, mouseButtons);
		}
		Object.defineProperty(this, "name", {
			writable: false,
		});
	}
	get keys() {
		return __classPrivateFieldGet$c(this, _keys);
	}
	get gamepadButtons() {
		return __classPrivateFieldGet$c(this, _gamepadButtons);
	}
	get mouseButtons() {
		return __classPrivateFieldGet$c(this, _mouseButtons);
	}
	remapKeys(keys) {
		__classPrivateFieldSet$c(this, _keys, keys);
	}
	remapGamepadButtons(buttons) {
		__classPrivateFieldSet$c(this, _gamepadButtons, buttons);
	}
	remapMouseButtons(buttons) {
		__classPrivateFieldSet$c(this, _mouseButtons, buttons);
	}
}
(_keys = new WeakMap()),
	(_gamepadButtons = new WeakMap()),
	(_mouseButtons = new WeakMap());

var __classPrivateFieldSet$d =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$d =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _inputMappings;
function _formatName(name) {
	return name.toLocaleLowerCase();
}
class InputProfile {
	constructor(name) {
		_inputMappings.set(this, void 0);
		this.name = name;
		__classPrivateFieldSet$d(this, _inputMappings, new Map());
	}
	createMapping(name, keys, gamepadButtons, mouseButtons) {
		const formattedName = _formatName(name);
		if (__classPrivateFieldGet$d(this, _inputMappings).has(formattedName)) {
			throw new TypeError(
				"An InputMapping with that name already exists; try a different name."
			);
		}
		const inputMapping = new InputMapping(
			formattedName,
			keys,
			gamepadButtons,
			mouseButtons
		);
		__classPrivateFieldGet$d(this, _inputMappings).set(
			inputMapping.name,
			inputMapping
		);
		return this;
	}
	getMapping(name) {
		const formattedName = _formatName(name);
		if (!__classPrivateFieldGet$d(this, _inputMappings).has(formattedName)) {
			throw new TypeError(
				"An InputMapping with that name has not been registered."
			);
		}
		return __classPrivateFieldGet$d(this, _inputMappings).get(formattedName);
	}
	remapKeys(name, keys) {
		var _a;
		(_a = this.getMapping(name)) === null || _a === void 0
			? void 0
			: _a.remapKeys(keys);
	}
	remapGamepadButtons(name, buttons) {
		var _a;
		(_a = this.getMapping(name)) === null || _a === void 0
			? void 0
			: _a.remapGamepadButtons(buttons);
	}
	remapMouseButtons(name, buttons) {
		var _a;
		(_a = this.getMapping(name)) === null || _a === void 0
			? void 0
			: _a.remapMouseButtons(buttons);
	}
	removeMapping(name) {
		const formattedName = _formatName(name);
		if (!__classPrivateFieldGet$d(this, _inputMappings).has(formattedName)) {
			throw new TypeError(
				"An InputMapping with that name has not been registered."
			);
		}
		__classPrivateFieldGet$d(this, _inputMappings).delete(formattedName);
		return this;
	}
}
_inputMappings = new WeakMap();

// @ts-nocheck
const _browserData = _getBrowserData();
const IS_BLINK = _browserData.isBlink;
/**
 * An imperfect means of getting the current browser.
 * Code taken directly from this Stack Overflow post: https://stackoverflow.com/a/9851769
 * (and slightly modified by me <3).
 */
function _getBrowserData() {
	// Opera 8.0+
	const isOpera =
		(!!window.opr && !!opr.addons) ||
		!!window.opera ||
		navigator.userAgent.indexOf(" OPR/") >= 0;
	// Firefox 1.0+
	const isFirefox = typeof InstallTrigger !== "undefined";
	// Safari 3.0+ "[object HTMLElementConstructor]"
	const isSafari =
		/constructor/i.test(window.HTMLElement) ||
		(function (p) {
			return p.toString() === "[object SafariRemoteNotification]";
		})(
			!window["safari"] ||
				(typeof safari !== "undefined" && safari.pushNotification)
		);
	// Internet Explorer 6-11
	const isIE = /*@cc_on!@*/  !!document.documentMode;
	// Edge 20+
	const isEdge = !isIE && !!window.StyleMedia;
	// Chrome 1 - 79
	const isChrome =
		!!window.chrome &&
		(!!window.chrome.webstore ||
			!!window.chrome.runtime ||
			!!window.chrome.csi);
	// Edge (based on chromium) detection
	const isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") != -1;
	// Blink engine detection
	const isBlink = (isChrome || isOpera) && !!window.CSS;
	let browserName = "";
	browserName = isOpera ? "opera" : browserName;
	browserName = isFirefox ? "firefox" : browserName;
	browserName = isSafari ? "safari" : browserName;
	browserName = isIE ? "ie" : browserName;
	browserName = isEdge ? "edge" : browserName;
	browserName = isChrome ? "chrome" : browserName;
	browserName = isEdgeChromium ? "edgechromium" : browserName;
	return {
		browserName: browserName,
		isBlink: isBlink,
	};
}

var __classPrivateFieldSet$e =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$e =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _data$3;
function _formatName$1(name) {
	return name.toLocaleLowerCase();
}
class ResourceHandler {
	constructor() {
		_data$3.set(this, void 0);
		__classPrivateFieldSet$e(this, _data$3, new Map());
	}
	get length() {
		return __classPrivateFieldGet$e(this, _data$3).entries.length;
	}
	get entries() {
		return __classPrivateFieldGet$e(this, _data$3).entries;
	}
	register(name, entry) {
		const formattedName = _formatName$1(name);
		if (__classPrivateFieldGet$e(this, _data$3).has(formattedName)) {
			throw new TypeError(
				"An entry with that name already exists; try a different name."
			);
		}
		__classPrivateFieldGet$e(this, _data$3).set(formattedName, entry);
	}
	get(name) {
		const formattedName = _formatName$1(name);
		if (!__classPrivateFieldGet$e(this, _data$3).has(formattedName)) {
			throw new TypeError("An entry with that name has not been registered.");
		}
		return __classPrivateFieldGet$e(this, _data$3).get(formattedName);
	}
	remove(name) {
		const formattedName = _formatName$1(name);
		if (!__classPrivateFieldGet$e(this, _data$3).has(formattedName)) {
			throw new TypeError("An entry with that name has not been registered.");
		}
		// * Eventually you would want to call dispose() here.
		__classPrivateFieldGet$e(this, _data$3).delete(formattedName);
	}
}
_data$3 = new WeakMap();

var __classPrivateFieldSet$f =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$f =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _dense, _sparse, _u, _n;
function* spareSetIterator(data) {
	for (let i = 0; i < data.length; i++) {
		yield data[i];
	}
}
/**
 * A data structure that stores a set of positive numbers that all fall within a given range.
 */
class SparseSet {
	/**
	 * Creates a data structure that stores a set of positive numbers that all fall within a given range.
	 * @param range The maximum amount of elements allowed inside the sparse set AND the maximum value allowed inside the set.
	 */
	constructor(range) {
		_dense.set(this, void 0);
		_sparse.set(this, void 0);
		_u.set(this, void 0);
		_n.set(this, void 0);
		if (range < 0) {
			throw new TypeError("The range must be greater than or equal to zero.");
		}
		__classPrivateFieldSet$f(this, _u, range);
		__classPrivateFieldSet$f(this, _n, 0);
		__classPrivateFieldSet$f(
			this,
			_sparse,
			new Array(__classPrivateFieldGet$f(this, _u)).fill(0)
		);
		__classPrivateFieldSet$f(
			this,
			_dense,
			new Array(__classPrivateFieldGet$f(this, _u)).fill(0)
		);
	}
	get size() {
		return __classPrivateFieldGet$f(this, _n);
	}
	get values() {
		return spareSetIterator(
			__classPrivateFieldGet$f(this, _dense).slice(
				0,
				__classPrivateFieldGet$f(this, _n)
			)
		);
	}
	/**
	 * Returns whether or not a given number is in the set.
	 * @param value The element to find in the set.
	 */
	has(value) {
		if (value < 0) {
			throw new TypeError("The 'value' parameter must be a positive number.");
		}
		return (
			value < __classPrivateFieldGet$f(this, _u) &&
			__classPrivateFieldGet$f(this, _sparse)[value] <
				__classPrivateFieldGet$f(this, _n) &&
			__classPrivateFieldGet$f(this, _dense)[
				__classPrivateFieldGet$f(this, _sparse)[value]
			] === value
		);
	}
	/**
	 * Adds a given positive number to the set.
	 * @param value The element to find in the set.
	 */
	add(value) {
		if (value >= __classPrivateFieldGet$f(this, _u)) {
			throw new TypeError(
				"The 'value' parameter cannot be greater than or equal to the SparseSet's range."
			);
		}
		if (this.has(value)) {
			return false;
		}
		__classPrivateFieldGet$f(this, _dense)[
			__classPrivateFieldGet$f(this, _n)
		] = value;
		__classPrivateFieldGet$f(this, _sparse)[value] = __classPrivateFieldGet$f(
			this,
			_n
		);
		__classPrivateFieldSet$f(this, _n, +__classPrivateFieldGet$f(this, _n) + 1);
		return true;
	}
	/**
	 * Removes a given positive number from the set.
	 * @param value The element to remove from the set.
	 */
	delete(value) {
		if (!this.has(value)) {
			return false;
		}
		__classPrivateFieldSet$f(this, _n, +__classPrivateFieldGet$f(this, _n) - 1);
		for (
			let i = __classPrivateFieldGet$f(this, _dense).indexOf(value);
			i < __classPrivateFieldGet$f(this, _n);
			i++
		) {
			__classPrivateFieldGet$f(this, _dense)[i] = __classPrivateFieldGet$f(
				this,
				_dense
			)[i + 1];
			__classPrivateFieldGet$f(this, _sparse)[
				__classPrivateFieldGet$f(this, _dense)[i + 1]
			] = i;
		}
		return true;
	}
	/**
	 * Removes all elements from the set.
	 */
	clear() {
		__classPrivateFieldSet$f(this, _n, 0);
	}
	// Support for iteration through a for-of loop.
	*[((_dense = new WeakMap()),
	(_sparse = new WeakMap()),
	(_u = new WeakMap()),
	(_n = new WeakMap()),
	Symbol.iterator)]() {
		for (let i = 0; i < __classPrivateFieldGet$f(this, _n); i++) {
			yield __classPrivateFieldGet$f(this, _dense)[i];
		}
	}
}

var __classPrivateFieldSet$g =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$g =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _transitionInProgress, _currentScene, _nextScene;
class SceneManager {
	constructor() {
		_transitionInProgress.set(this, void 0);
		_currentScene.set(this, void 0);
		_nextScene.set(this, void 0);
		this.scenes = new ResourceHandler();
		__classPrivateFieldSet$g(this, _transitionInProgress, false);
		__classPrivateFieldSet$g(this, _currentScene, null);
		__classPrivateFieldSet$g(this, _nextScene, null);
		Object.defineProperty(this, "scenes", {
			writable: false,
		});
		Object.defineProperty(this, "graphics", {
			writable: false,
		});
	}
	register(...scenes) {
		for (let i = 0; i < scenes.length; i++) {
			this.scenes.register(scenes[i].name, scenes[i]);
		}
		return this;
	}
	queue(name) {
		const scene = this.scenes.get(name);
		if (scene === undefined) {
			throw new Error("Something went wrong!");
		}
		__classPrivateFieldSet$g(this, _nextScene, scene);
		__classPrivateFieldSet$g(this, _transitionInProgress, true);
	}
	update(deltaTime) {
		var _a;
		this.updateTransitions();
		(_a = __classPrivateFieldGet$g(this, _currentScene)) === null || _a === void 0
			? void 0
			: _a.update(deltaTime);
	}
	draw(graphics, deltaTime) {
		var _a;
		(_a = __classPrivateFieldGet$g(this, _currentScene)) === null || _a === void 0
			? void 0
			: _a.draw(graphics, deltaTime);
	}
	updateTransitions() {
		var _a, _b;
		if (!__classPrivateFieldGet$g(this, _transitionInProgress)) {
			return;
		}
		// * Below is all temporary for now since transitions do not exist 😉
		(_a = __classPrivateFieldGet$g(this, _currentScene)) === null || _a === void 0
			? void 0
			: _a.onExit();
		(_b = __classPrivateFieldGet$g(this, _nextScene)) === null || _b === void 0
			? void 0
			: _b.onEnter();
		__classPrivateFieldSet$g(
			this,
			_currentScene,
			__classPrivateFieldGet$g(this, _nextScene)
		);
		__classPrivateFieldSet$g(this, _transitionInProgress, false);
	}
}
(_transitionInProgress = new WeakMap()),
	(_currentScene = new WeakMap()),
	(_nextScene = new WeakMap());

const SQUARE = _createSquare();
const TRIANGLE = _createTriangle();
const CIRCLE = createRegularPolygonMesh(90);
/**
 * Creates a mesh of a filled regular polygon with a given amount of vertices.
 * @param totalVertices The total amount of vertices the regular polygon will have.
 */
function createRegularPolygonMesh(totalVertices) {
	if (totalVertices <= 2) {
		throw new TypeError("A polygon must have at least 3 vertices.");
	}
	const twoPi = Math.PI * 2;
	const vertices = [];
	const indices = [];
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
	return new Mesh(vertices, indices);
}
function _createSquare() {
	return new Mesh(
		[0, 0, 0, 1, 0, 0, 1, -1, 0, 0, -1, 0],
		[0, 3, 1, 1, 3, 2]
	);
}
function _createTriangle() {
	const cos30 = Math.sqrt(3) / 2;
	return new Mesh(
		[1 - cos30, 0, 0, 1, -0.5, 0, 1 - cos30, -1, 0],
		[0, 2, 1]
	);
}

const _attributeSchema = new AttributeSchema([
	new AttributeElement(
		"a_vertexPosition",
		3,
		ATTRIBUTE_TYPES.FLOAT
	),
]);
class GeometryData {
	constructor(graphics, mesh) {
		this.vertexBuffer = new VertexBuffer(
			graphics,
			_attributeSchema,
			mesh.vertices.length,
			VERTEX_USAGE.STATIC
		);
		this.indexBuffer = new IndexBuffer(graphics, mesh.indices.length);
		this.totalVertices = mesh.totalVertices;
		this.totalTriangles = mesh.totalIndices / 3;
		this.vertexBuffer.setData(mesh.vertices);
		this.indexBuffer.setData(mesh.indices);
		Object.defineProperty(this, "vertexBuffer", {
			writable: false,
		});
		Object.defineProperty(this, "indexBuffer", {
			writable: false,
		});
		Object.defineProperty(this, "totalVertices", {
			writable: false,
		});
		Object.defineProperty(this, "totalTriangles", {
			writable: false,
		});
	}
}

var __classPrivateFieldSet$h =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$h =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _graphics$1, _geometry;
class GeometryManager {
	constructor(graphics) {
		_graphics$1.set(this, void 0);
		_geometry.set(this, void 0);
		__classPrivateFieldSet$h(this, _graphics$1, graphics);
		__classPrivateFieldSet$h(this, _geometry, new ResourceHandler());
		this.createDefaults();
	}
	registerGeometry(name, geometry) {
		__classPrivateFieldGet$h(this, _geometry).register(name, geometry);
		return this;
	}
	getGeometry(name) {
		return __classPrivateFieldGet$h(this, _geometry).get(name);
	}
	removeGeometry(name) {
		__classPrivateFieldGet$h(this, _geometry).remove(name);
		return this;
	}
	createDefaults() {
		this.registerGeometry(
			"Susurrus_Circle",
			new GeometryData(__classPrivateFieldGet$h(this, _graphics$1), CIRCLE)
		);
		this.registerGeometry(
			"Susurrus_Square",
			new GeometryData(__classPrivateFieldGet$h(this, _graphics$1), SQUARE)
		);
		this.registerGeometry(
			"Susurrus_Triangle",
			new GeometryData(__classPrivateFieldGet$h(this, _graphics$1), TRIANGLE)
		);
	}
}
(_graphics$1 = new WeakMap()), (_geometry = new WeakMap());

var __classPrivateFieldSet$i =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$i =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _mesh,
	_modelBuffer,
	_geometryData,
	_effect,
	_x$1,
	_y$1,
	_z,
	_width$2,
	_height$2,
	_translation,
	_scale$1,
	_rotationOffset,
	_rotation,
	_color,
	_meshChanged,
	_transformChanged;
const _attributeSchema$1 = new AttributeSchema([
	new AttributeElement(
		"a_translation",
		3,
		ATTRIBUTE_TYPES.FLOAT
	),
	new AttributeElement("a_scale", 3, ATTRIBUTE_TYPES.FLOAT),
	new AttributeElement(
		"a_rotationOffset",
		3,
		ATTRIBUTE_TYPES.FLOAT
	),
	new AttributeElement("a_rotation", 1, ATTRIBUTE_TYPES.FLOAT),
	new AttributeElement("a_color", 4, ATTRIBUTE_TYPES.FLOAT),
]);
class Polygon {
	constructor(mesh, x, y, width, height) {
		//#endregion
		_mesh.set(this, void 0);
		_modelBuffer.set(this, void 0);
		_geometryData.set(this, void 0);
		_effect.set(this, void 0);
		_x$1.set(this, void 0);
		_y$1.set(this, void 0);
		_z.set(this, void 0);
		_width$2.set(this, void 0);
		_height$2.set(this, void 0);
		_translation.set(this, void 0);
		_scale$1.set(this, void 0);
		_rotationOffset.set(this, void 0);
		_rotation.set(this, void 0);
		_color.set(this, void 0);
		_meshChanged.set(this, void 0);
		_transformChanged.set(this, void 0);
		__classPrivateFieldSet$i(this, _mesh, mesh);
		__classPrivateFieldSet$i(this, _geometryData, null);
		__classPrivateFieldSet$i(this, _modelBuffer, null);
		__classPrivateFieldSet$i(this, _x$1, x);
		__classPrivateFieldSet$i(this, _y$1, y);
		__classPrivateFieldSet$i(this, _z, 0);
		__classPrivateFieldSet$i(this, _width$2, width);
		__classPrivateFieldSet$i(this, _height$2, height);
		__classPrivateFieldSet$i(this, _translation, new Vector3(0, 0, 0));
		__classPrivateFieldSet$i(this, _scale$1, new Vector3(1, 1, 1));
		__classPrivateFieldSet$i(this, _rotationOffset, new Vector3(0, 0, 0));
		__classPrivateFieldSet$i(this, _rotation, 0);
		__classPrivateFieldSet$i(this, _color, new Color(0xffffff));
		__classPrivateFieldSet$i(this, _meshChanged, false);
		__classPrivateFieldSet$i(this, _transformChanged, false);
		__classPrivateFieldSet$i(this, _effect, null);
	}
	//#region Getters and Setters
	get x() {
		return __classPrivateFieldGet$i(this, _x$1);
	}
	set x(value) {
		if (value === __classPrivateFieldGet$i(this, _x$1)) {
			return;
		}
		__classPrivateFieldSet$i(this, _x$1, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get y() {
		return __classPrivateFieldGet$i(this, _y$1);
	}
	set y(value) {
		if (value === __classPrivateFieldGet$i(this, _y$1)) {
			return;
		}
		__classPrivateFieldSet$i(this, _y$1, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get z() {
		return __classPrivateFieldGet$i(this, _z);
	}
	set z(value) {
		if (value === __classPrivateFieldGet$i(this, _z)) {
			return;
		}
		__classPrivateFieldSet$i(this, _z, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get width() {
		return __classPrivateFieldGet$i(this, _width$2);
	}
	set width(value) {
		if (value === __classPrivateFieldGet$i(this, _width$2)) {
			return;
		}
		__classPrivateFieldSet$i(this, _width$2, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get height() {
		return __classPrivateFieldGet$i(this, _height$2);
	}
	set height(value) {
		if (value === __classPrivateFieldGet$i(this, _height$2)) {
			return;
		}
		__classPrivateFieldSet$i(this, _height$2, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get translation() {
		return __classPrivateFieldGet$i(this, _translation);
	}
	set translation(value) {
		if (value === __classPrivateFieldGet$i(this, _translation)) {
			return;
		}
		__classPrivateFieldSet$i(this, _translation, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get scale() {
		return __classPrivateFieldGet$i(this, _scale$1);
	}
	set scale(value) {
		if (value === __classPrivateFieldGet$i(this, _scale$1)) {
			return;
		}
		__classPrivateFieldSet$i(this, _scale$1, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get rotationOffset() {
		return __classPrivateFieldGet$i(this, _rotationOffset);
	}
	set rotationOffset(value) {
		if (value === __classPrivateFieldGet$i(this, _rotationOffset)) {
			return;
		}
		__classPrivateFieldSet$i(this, _rotationOffset, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get rotation() {
		return __classPrivateFieldGet$i(this, _rotation);
	}
	set rotation(value) {
		if (value === __classPrivateFieldGet$i(this, _rotation)) {
			return;
		}
		__classPrivateFieldSet$i(this, _rotation, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get color() {
		return __classPrivateFieldGet$i(this, _color);
	}
	set color(value) {
		if (value === __classPrivateFieldGet$i(this, _color)) {
			return;
		}
		__classPrivateFieldSet$i(this, _color, value);
		__classPrivateFieldSet$i(this, _transformChanged, true);
	}
	get position() {
		return new Vector3(
			__classPrivateFieldGet$i(this, _x$1),
			__classPrivateFieldGet$i(this, _y$1),
			__classPrivateFieldGet$i(this, _z)
		);
	}
	get aabb() {
		return new Rectangle(
			__classPrivateFieldGet$i(this, _x$1),
			__classPrivateFieldGet$i(this, _y$1),
			__classPrivateFieldGet$i(this, _width$2),
			__classPrivateFieldGet$i(this, _height$2)
		);
	}
	setPosition(x, y, z) {
		__classPrivateFieldSet$i(this, _x$1, x);
		__classPrivateFieldSet$i(this, _y$1, y);
		__classPrivateFieldSet$i(this, _z, z);
		__classPrivateFieldSet$i(this, _transformChanged, true);
		return this;
	}
	attachMesh(mesh) {
		__classPrivateFieldSet$i(this, _mesh, mesh);
		__classPrivateFieldSet$i(this, _meshChanged, true);
		return this;
	}
	attachGeometry(geometry) {
		__classPrivateFieldSet$i(this, _geometryData, geometry);
		return this;
	}
	attachEffect(effect) {
		__classPrivateFieldSet$i(this, _effect, effect);
		return this;
	}
	/**
	 * Creates a new GeometryData object from the prexsisting mesh, and attaches it to the polygon.
	 * @param graphics The current theater's GraphicsManager.
	 */
	createGeometry(graphics) {
		__classPrivateFieldSet$i(
			this,
			_geometryData,
			new GeometryData(graphics, __classPrivateFieldGet$i(this, _mesh))
		);
		return this;
	}
	/**
	 * Creates a buffer that handles model specific transformations and properties.
	 * @param graphics The current theater's GraphicsManager.
	 */
	createModelBuffer(graphics) {
		__classPrivateFieldSet$i(this, _meshChanged, false);
		// I hate this but for some reason Blink doesnt bode well with VertexUsage.DYNAMIC.
		// Refer to this issue for more info: https://github.com/thismarvin/susurrus/issues/5
		let modelLength = _attributeSchema$1.size;
		if (IS_BLINK) {
			modelLength *= __classPrivateFieldGet$i(this, _mesh).totalVertices;
		}
		__classPrivateFieldSet$i(
			this,
			_modelBuffer,
			new VertexBuffer(
				graphics,
				_attributeSchema$1,
				modelLength,
				VERTEX_USAGE.DYNAMIC,
				1
			)
		);
		this.updateModelBuffer();
		return this;
	}
	/**
	 * Creates and returns a 4x4 matrix that represents all of the polygon's transformations.
	 */
	calculateTransform() {
		const scale = Matrix4.createScale(
			this.width * this.scale.x,
			this.height * this.scale.y,
			this.scale.z
		);
		const preTranslation = Matrix4.createTranslation(
			-this.rotationOffset.x,
			-this.rotationOffset.y,
			0
		);
		const rotation = Matrix4.createRotationZ(this.rotation);
		const postTranslation = Matrix4.createTranslation(
			this.x + this.translation.x + this.rotationOffset.x,
			this.y + this.translation.y + this.rotationOffset.y,
			this.translation.z
		);
		const mul = Matrix4.multiply;
		return mul(mul(mul(scale, preTranslation), rotation), postTranslation);
	}
	/**
	 * Updates the model buffer to reflect any new changes.
	 */
	applyChanges() {
		if (__classPrivateFieldGet$i(this, _modelBuffer) === null) {
			throw new TypeError(
				"A model has not been created; cannot apply changes."
			);
		}
		__classPrivateFieldSet$i(this, _transformChanged, false);
		this.updateModelBuffer();
	}
	draw(graphics, camera) {
		if (
			__classPrivateFieldGet$i(this, _geometryData) === null ||
			__classPrivateFieldGet$i(this, _modelBuffer) === null ||
			__classPrivateFieldGet$i(this, _effect) === null
		) {
			return;
		}
		if (__classPrivateFieldGet$i(this, _meshChanged)) {
			throw new TypeError(
				"The polygon's mesh was modified, but a new model was not created. Make sure to call createModel(graphics)."
			);
		}
		if (__classPrivateFieldGet$i(this, _transformChanged)) {
			throw new TypeError(
				"The polygon's transform was modified, but applyChanges() was never called."
			);
		}
		graphics
			.begin(__classPrivateFieldGet$i(this, _effect))
			.setVertexBuffer(
				__classPrivateFieldGet$i(this, _geometryData).vertexBuffer,
				__classPrivateFieldGet$i(this, _modelBuffer)
			)
			.setIndexBuffer(__classPrivateFieldGet$i(this, _geometryData).indexBuffer)
			.setUniform("worldViewProjection", camera.wvp.data)
			.drawElements(
				DRAW_MODES.TRIANGLES,
				__classPrivateFieldGet$i(this, _geometryData).totalTriangles,
				0
			)
			.end();
	}
	updateModelBuffer() {
		if (__classPrivateFieldGet$i(this, _modelBuffer) === null) {
			return;
		}
		let bufferData = [];
		bufferData = bufferData.concat(
			new Vector3(
				__classPrivateFieldGet$i(this, _x$1) + this.translation.x,
				__classPrivateFieldGet$i(this, _y$1) + this.translation.y,
				__classPrivateFieldGet$i(this, _z) + this.translation.z
			).toArray()
		);
		bufferData = bufferData.concat(
			new Vector3(
				__classPrivateFieldGet$i(this, _width$2) *
					__classPrivateFieldGet$i(this, _scale$1).x,
				__classPrivateFieldGet$i(this, _height$2) *
					__classPrivateFieldGet$i(this, _scale$1).y,
				__classPrivateFieldGet$i(this, _scale$1).z
			).toArray()
		);
		bufferData = bufferData.concat(
			__classPrivateFieldGet$i(this, _rotationOffset).toArray()
		);
		bufferData = bufferData.concat(__classPrivateFieldGet$i(this, _rotation));
		bufferData = bufferData.concat(
			__classPrivateFieldGet$i(this, _color).toArray()
		);
		__classPrivateFieldGet$i(this, _modelBuffer).setData(bufferData);
	}
}
(_mesh = new WeakMap()),
	(_modelBuffer = new WeakMap()),
	(_geometryData = new WeakMap()),
	(_effect = new WeakMap()),
	(_x$1 = new WeakMap()),
	(_y$1 = new WeakMap()),
	(_z = new WeakMap()),
	(_width$2 = new WeakMap()),
	(_height$2 = new WeakMap()),
	(_translation = new WeakMap()),
	(_scale$1 = new WeakMap()),
	(_rotationOffset = new WeakMap()),
	(_rotation = new WeakMap()),
	(_color = new WeakMap()),
	(_meshChanged = new WeakMap()),
	(_transformChanged = new WeakMap());

class Quad extends Polygon {
	constructor(x, y, width, height) {
		super(SQUARE, x, y, width, height);
	}
}

class Circle extends Polygon {
	constructor(x, y, radius) {
		super(CIRCLE, x, y, radius * 2, radius * 2);
		this.radius = radius;
	}
}

const POLYGON_SHADER = {
	VERTEX: `
		uniform mat4 worldViewProjection;

		attribute vec3 a_vertexPosition;
		attribute vec3 a_translation;
		attribute vec3 a_scale;
		attribute vec3 a_rotationOffset;
		attribute float a_rotation;
		attribute vec4 a_color;

		varying lowp vec4 v_color;

		mat4 createTranslation(vec3 translation) {
			return mat4(
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				translation.x, translation.y, translation.z, 1
			);
		}

		mat4 createScale(vec3 scale) {
			return mat4(
				scale.x, 0, 0, 0,
				0, scale.y, 0, 0,
				0, 0, scale.z, 0,
				0, 0, 0, 1
			);
		}

		mat4 createRotationZ(float theta) {
			return mat4(
				cos(theta), -sin(theta), 0, 0,
				sin(theta), cos(theta), 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			);
		}

		void main() {
			mat4 model = createTranslation(a_translation - a_rotationOffset) * createRotationZ(a_rotation) * createTranslation(a_rotationOffset) * createScale(a_scale);
			gl_Position = worldViewProjection * model * vec4(a_vertexPosition, 1);

			v_color = a_color;
		}
	`,
	FRAGMENT: `
		varying lowp vec4 v_color;

		void main() {
			gl_FragColor = v_color;
		}
	`,
};
Object.freeze(POLYGON_SHADER);

class PolygonEffect extends Effect {
	constructor(graphics) {
		super(graphics, POLYGON_SHADER.VERTEX, POLYGON_SHADER.FRAGMENT);
	}
}

var __classPrivateFieldSet$j =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$j =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _theater, _graphics$2, _sharedPolygonEffect;
class Factory {
	constructor(theater) {
		_theater.set(this, void 0);
		_graphics$2.set(this, void 0);
		_sharedPolygonEffect.set(this, void 0);
		__classPrivateFieldSet$j(this, _theater, theater);
		__classPrivateFieldSet$j(this, _graphics$2, null);
		__classPrivateFieldSet$j(this, _sharedPolygonEffect, null);
	}
	attachGraphics(graphics) {
		__classPrivateFieldSet$j(this, _graphics$2, graphics);
		__classPrivateFieldSet$j(
			this,
			_sharedPolygonEffect,
			new PolygonEffect(__classPrivateFieldGet$j(this, _graphics$2))
		);
	}
	createCircle(x, y, radius) {
		if (__classPrivateFieldGet$j(this, _graphics$2) === null) {
			throw new TypeError(
				"A GraphicsManager has not been attached; cannot create geometry. Make sure to call 'attachGraphics(graphics)' before using a Factory."
			);
		}
		if (__classPrivateFieldGet$j(this, _sharedPolygonEffect) === null) {
			throw new Error(
				"Something unexpected happen! Could not create shared PolygonEffect."
			);
		}
		if (__classPrivateFieldGet$j(this, _theater).geometryManager === null) {
			throw new Error(
				"Something unexpected happen! The Theater's GeometryManager was not initialized."
			);
		}
		const geometry = __classPrivateFieldGet$j(
			this,
			_theater
		).geometryManager.getGeometry("Susurrus_Circle");
		if (geometry === undefined) {
			throw new Error("Could not find geometry.");
		}
		const circle = new Circle(x, y, radius)
			.attachEffect(__classPrivateFieldGet$j(this, _sharedPolygonEffect))
			.attachGeometry(geometry)
			.createModelBuffer(__classPrivateFieldGet$j(this, _graphics$2));
		return circle;
	}
	createQuad(x, y, width, height) {
		if (__classPrivateFieldGet$j(this, _graphics$2) === null) {
			throw new TypeError(
				"A GraphicsManager has not been attached; cannot create geometry. Make sure to call 'attachGraphics(graphics)' before using a Factory."
			);
		}
		if (__classPrivateFieldGet$j(this, _sharedPolygonEffect) === null) {
			throw new Error(
				"Something unexpected happen! Could not create shared PolygonEffect."
			);
		}
		if (__classPrivateFieldGet$j(this, _theater).geometryManager === null) {
			throw new Error(
				"Something unexpected happen! The Theater's GeometryManager was not initialized."
			);
		}
		const geometry = __classPrivateFieldGet$j(
			this,
			_theater
		).geometryManager.getGeometry("Susurrus_Square");
		if (geometry === undefined) {
			throw new Error("Could not find geometry.");
		}
		const quad = new Quad(x, y, width, height)
			.attachEffect(__classPrivateFieldGet$j(this, _sharedPolygonEffect))
			.attachGeometry(geometry)
			.createModelBuffer(__classPrivateFieldGet$j(this, _graphics$2));
		return quad;
	}
}
(_theater = new WeakMap()),
	(_graphics$2 = new WeakMap()),
	(_sharedPolygonEffect = new WeakMap());

var __classPrivateFieldSet$k =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$k =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _parent,
	_canvas,
	_graphics$3,
	_geometryManager,
	_initialized,
	_inFocus,
	_totalElapsedTime,
	_args;
class Theater {
	constructor() {
		_parent.set(this, void 0);
		_canvas.set(this, void 0);
		_graphics$3.set(this, void 0);
		_geometryManager.set(this, void 0);
		_initialized.set(this, void 0);
		_inFocus.set(this, void 0);
		_totalElapsedTime.set(this, void 0);
		_args.set(this, void 0);
		__classPrivateFieldSet$k(this, _parent, null);
		__classPrivateFieldSet$k(this, _canvas, null);
		__classPrivateFieldSet$k(this, _graphics$3, null);
		__classPrivateFieldSet$k(this, _geometryManager, null);
		this.smartKeyboard = new SmartKeyboard();
		this.smartPointer = new SmartPointer();
		this.sceneManager = new SceneManager();
		this.factory = new Factory(this);
		this.loop = true;
		__classPrivateFieldSet$k(this, _initialized, false);
		__classPrivateFieldSet$k(this, _inFocus, false);
		__classPrivateFieldSet$k(this, _totalElapsedTime, 0);
		__classPrivateFieldSet$k(this, _args, []);
		window.addEventListener("mousedown", (event) => {
			if (__classPrivateFieldGet$k(this, _canvas) === null) {
				return;
			}
			__classPrivateFieldSet$k(
				this,
				_inFocus,
				event.target === __classPrivateFieldGet$k(this, _canvas)
			);
		});
		Object.defineProperty(this, "smartKeyboard", {
			writable: false,
		});
		Object.defineProperty(this, "smartPointer", {
			writable: false,
		});
		Object.defineProperty(this, "sceneManager", {
			writable: false,
		});
		Object.defineProperty(this, "factory", {
			writable: false,
		});
	}
	get parent() {
		return __classPrivateFieldGet$k(this, _parent);
	}
	get canvas() {
		return __classPrivateFieldGet$k(this, _canvas);
	}
	get graphics() {
		return __classPrivateFieldGet$k(this, _graphics$3);
	}
	get geometryManager() {
		return __classPrivateFieldGet$k(this, _geometryManager);
	}
	get inFocus() {
		return __classPrivateFieldGet$k(this, _inFocus);
	}
	get totalElapsedTime() {
		return __classPrivateFieldGet$k(this, _totalElapsedTime);
	}
	get args() {
		return __classPrivateFieldGet$k(this, _args);
	}
	/**
	 * Jumpstarts the runtime of your project.
	 * @param args An optional string that serves as command-line arguments for the theater.
	 */
	run(args) {
		if (!__classPrivateFieldGet$k(this, _initialized)) {
			if (args !== undefined) {
				const test = args.trim().split(" ");
				__classPrivateFieldSet$k(this, _args, test);
			}
			this.initialize();
			__classPrivateFieldSet$k(this, _initialized, true);
		}
		this.main(0);
	}
	/**
	 * Finds an HTMLElement with a given id, and sets the element as the parent of the theater.
	 * Any HTMLElements created using this theater will be appended to said parent.
	 * @param id The id of an existing HTMLElement on the current page.
	 */
	setParent(id) {
		const element = document.getElementById(id);
		if (element === null) {
			throw new TypeError(`Could not find an element with an id of '${id}'.`);
		}
		__classPrivateFieldSet$k(this, _parent, element);
		return this;
	}
	/**
	 * Creates and appends a new HTMLCanvas to the theater's parent HTMLElement.
	 * Moreover, a valid GraphicsManager is created and initialized.
	 * @param id The id the new HTMLCanvas should have.
	 * @param width The width of the new HTMLCanvas.
	 * @param height The height of the new HTMLCanvas.
	 */
	createCanvas(id, width, height) {
		if (__classPrivateFieldGet$k(this, _parent) === null) {
			throw new Error(
				"A parent element does not exist; a canvas cannot be created. Make sure to call that 'setParent(id)' was called."
			);
		}
		__classPrivateFieldSet$k(this, _canvas, document.createElement("canvas"));
		__classPrivateFieldGet$k(this, _canvas).id = id;
		__classPrivateFieldGet$k(this, _canvas).width = width;
		__classPrivateFieldGet$k(this, _canvas).height = height;
		__classPrivateFieldGet$k(this, _parent).appendChild(
			__classPrivateFieldGet$k(this, _canvas)
		);
		__classPrivateFieldSet$k(
			this,
			_graphics$3,
			new Graphics(
				getWebGLContext(__classPrivateFieldGet$k(this, _canvas))
			)
		);
		__classPrivateFieldSet$k(
			this,
			_geometryManager,
			new GeometryManager(__classPrivateFieldGet$k(this, _graphics$3))
		);
		this.factory.attachGraphics(__classPrivateFieldGet$k(this, _graphics$3));
		this.smartPointer.attachElement(__classPrivateFieldGet$k(this, _canvas));
	}
	/**
	 * A method that is called once at the start of runtime that is typically used to setup your project.
	 */
	initialize() {}
	/**
	 * A method called once every frame, before draw, that is typically used to perform runtime calculations and logic.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	update(deltaTime) {
		this.sceneManager.update(deltaTime);
	}
	/**
	 * A method called once every frame, after update, that is typically used to present visuals.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	draw(deltaTime) {
		if (__classPrivateFieldGet$k(this, _graphics$3) === null) {
			throw new TypeError(
				"The GraphicsManager has not been instantiated; cannot draw anything. Make sure to call appendCanvas() before rendering anything."
			);
		}
		this.sceneManager.draw(__classPrivateFieldGet$k(this, _graphics$3), deltaTime);
	}
	/**
	 * Code that is integral to the engine that is guaranteed to be updated every frame.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	// eslint-disable-next-line no-unused-vars
	managedUpdate(deltaTime) {
		this.smartKeyboard.update();
		this.smartPointer.update();
	}
	main(timeStamp) {
		let deltaTime =
			(timeStamp - __classPrivateFieldGet$k(this, _totalElapsedTime)) / 1000;
		if (Number.isNaN(deltaTime)) {
			deltaTime = 0;
		}
		__classPrivateFieldSet$k(this, _totalElapsedTime, timeStamp);
		this.managedUpdate(deltaTime);
		this.update(deltaTime);
		if (this.graphics !== null) {
			this.draw(deltaTime);
		}
		if (this.loop) {
			window.requestAnimationFrame((timeStamp) => {
				this.main(timeStamp);
			});
		}
	}
}
(_parent = new WeakMap()),
	(_canvas = new WeakMap()),
	(_graphics$3 = new WeakMap()),
	(_geometryManager = new WeakMap()),
	(_initialized = new WeakMap()),
	(_inFocus = new WeakMap()),
	(_totalElapsedTime = new WeakMap()),
	(_args = new WeakMap());

const BASIC = {
	BLACK: new Color(0x000000),
	WHITE: new Color(0xffffff),
	RED: new Color(0xff0000),
	GREEN: new Color(0x00ff00),
	BLUE: new Color(0x0000ff),
};
Object.freeze(BASIC);
const PICO8 = {
	SKY_BLUE: new Color(0x29adff),
};
Object.freeze(PICO8);

var palettes = /*#__PURE__*/Object.freeze({
	__proto__: null,
	BASIC: BASIC,
	PICO8: PICO8
});

var __classPrivateFieldSet$l =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$l =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _texture, _geometryData$1, _effect$1, _textureBuffer, _modelBuffer$1;
const _attributeSchemaTexture = new AttributeSchema([
	new AttributeElement("a_textureCoord", 2, ATTRIBUTE_TYPES.FLOAT),
]);
const _attributeSchemaModel = new AttributeSchema([
	new AttributeElement("a_scale", 3, ATTRIBUTE_TYPES.FLOAT),
]);
class Sprite {
	constructor(texture) {
		_texture.set(this, void 0);
		_geometryData$1.set(this, void 0);
		_effect$1.set(this, void 0);
		_textureBuffer.set(this, void 0);
		_modelBuffer$1.set(this, void 0);
		__classPrivateFieldSet$l(this, _texture, texture);
		__classPrivateFieldSet$l(this, _geometryData$1, null);
		__classPrivateFieldSet$l(this, _effect$1, null);
		__classPrivateFieldSet$l(this, _textureBuffer, null);
		__classPrivateFieldSet$l(this, _modelBuffer$1, null);
	}
	attachGeometry(geometry) {
		__classPrivateFieldSet$l(this, _geometryData$1, geometry);
		return this;
	}
	attachEffect(effect) {
		__classPrivateFieldSet$l(this, _effect$1, effect);
		return this;
	}
	createTextureBuffer(graphics) {
		__classPrivateFieldSet$l(
			this,
			_textureBuffer,
			new VertexBuffer(graphics, _attributeSchemaTexture, 8, VERTEX_USAGE.STATIC)
		);
		__classPrivateFieldGet$l(this, _textureBuffer).setData([
			0,
			0,
			1,
			0,
			1,
			1,
			0,
			1,
		]);
		let modelLength = _attributeSchemaModel.size;
		if (IS_BLINK) {
			modelLength *= 6;
		}
		__classPrivateFieldSet$l(
			this,
			_modelBuffer$1,
			new VertexBuffer(
				graphics,
				_attributeSchemaModel,
				modelLength,
				VERTEX_USAGE.DYNAMIC,
				1
			)
		);
		__classPrivateFieldGet$l(this, _modelBuffer$1).setData([
			__classPrivateFieldGet$l(this, _texture).width,
			__classPrivateFieldGet$l(this, _texture).height,
			1,
		]);
		return this;
	}
	draw(graphics, camera) {
		if (
			__classPrivateFieldGet$l(this, _texture).data === null ||
			__classPrivateFieldGet$l(this, _geometryData$1) === null ||
			__classPrivateFieldGet$l(this, _effect$1) === null ||
			__classPrivateFieldGet$l(this, _textureBuffer) === null ||
			__classPrivateFieldGet$l(this, _modelBuffer$1) === null
		) {
			return;
		}
		graphics
			.begin(__classPrivateFieldGet$l(this, _effect$1))
			.setVertexBuffer(
				__classPrivateFieldGet$l(this, _geometryData$1).vertexBuffer,
				__classPrivateFieldGet$l(this, _textureBuffer),
				__classPrivateFieldGet$l(this, _modelBuffer$1)
			)
			.setIndexBuffer(__classPrivateFieldGet$l(this, _geometryData$1).indexBuffer)
			.setUniform("worldViewProjection", camera.wvp.data)
			.setUniform2("sampler")
			.setTexture(__classPrivateFieldGet$l(this, _texture).data)
			.drawElements(
				DRAW_MODES.TRIANGLES,
				__classPrivateFieldGet$l(this, _geometryData$1).totalTriangles,
				0
			)
			.end();
	}
}
(_texture = new WeakMap()),
	(_geometryData$1 = new WeakMap()),
	(_effect$1 = new WeakMap()),
	(_textureBuffer = new WeakMap()),
	(_modelBuffer$1 = new WeakMap());

const SPRITE_SHADERS = {
	VERTEX: `
		uniform mat4 worldViewProjection;

		attribute vec3 a_vertexPosition;
		attribute vec2 a_textureCoord;
		attribute vec3 a_scale;

		varying highp vec2 v_textureCoord;

		mat4 createScale(vec3 scale) {
			return mat4(
					scale.x, 0, 0, 0,
					0, scale.y, 0, 0,
					0, 0, scale.z, 0,
					0, 0, 0, 1
			);
		}

		void main() {
			mat4 model = createScale(a_scale);
			gl_Position = worldViewProjection * model * vec4(a_vertexPosition, 1);

			v_textureCoord = a_textureCoord;
		}
		`,
	FRAGMENT: `
		uniform sampler2D sampler;

		varying highp vec2 v_textureCoord;

		void main() {
			gl_FragColor = texture2D(sampler, v_textureCoord);
		}
    `,
};
Object.freeze(SPRITE_SHADERS);

// eslint-disable-next-line no-unused-vars
class SpriteEffect extends Effect {
	constructor(graphics) {
		super(graphics, SPRITE_SHADERS.VERTEX, SPRITE_SHADERS.FRAGMENT);
	}
}

/**
 * An abstraction of a class that implements spatial partitioning capabilities.
 */
class Partitioner {
	/**
	 * Creates An abstraction of a class that implements spatial partitioning capabilities.
	 * @param boundary The area that the partitioner will cover.
	 */
	constructor(boundary) {
		this.boundary = boundary;
	}
	/**
	 * Adds a list of IPartitionable entries to the partitioner.
	 * @param entries The list of IPartitionable entries to add to the partitioner.
	 */
	addRange(entries) {
		for (let i = 0; i < entries.length; i++) {
			this.add(entries[i]);
		}
	}
}

var __classPrivateFieldSet$m =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$m =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _validatedBoundary, _powerOfTwo, _bucketSize, _columns$2, _rows$2, _buckets;
function _constrainPoint(point, boundary) {
	let xConstrained = point.x;
	let yConstrained = point.y;
	xConstrained = Math.max(boundary.left, xConstrained);
	xConstrained = Math.min(boundary.right, xConstrained);
	yConstrained = Math.max(boundary.bottom, yConstrained);
	yConstrained = Math.min(boundary.top, yConstrained);
	return {
		x: xConstrained,
		y: yConstrained,
	};
}
function _constrainRectangle(rectangle, boundary) {
	const constrainedTopLeft = _constrainPoint(
		{ x: rectangle.x, y: rectangle.y },
		boundary
	);
	const constrainedWidth = Math.min(
		rectangle.width,
		boundary.right - constrainedTopLeft.x
	);
	const constrainedHeight = Math.min(
		rectangle.height,
		constrainedTopLeft.y - boundary.bottom
	);
	return new Rectangle(
		constrainedTopLeft.x,
		constrainedTopLeft.y,
		constrainedWidth,
		constrainedHeight
	);
}
/**
 * An implementation of a Partitioner that uses a hashing algorithm to store and retrieve IPartitionable entries.
 */
class Bin extends Partitioner {
	/**
	 * Creates an implementation of a Partitioner that uses a hashing algorithm to store and retrieve IPartitionable entries.
	 * @param boundary The area that the partitioner will cover.
	 * @param maximumDimension The maximum expected size of any IPartionable entry inserted into the bin.
	 */
	constructor(boundary, maximumDimension) {
		super(boundary);
		_validatedBoundary.set(this, void 0);
		_powerOfTwo.set(this, void 0);
		_bucketSize.set(this, void 0);
		_columns$2.set(this, void 0);
		_rows$2.set(this, void 0);
		_buckets.set(this, void 0);
		__classPrivateFieldSet$m(
			this,
			_validatedBoundary,
			new Rectangle(
				remapRange(
					this.boundary.x,
					this.boundary.left,
					this.boundary.right,
					0,
					this.boundary.width
				),
				remapRange(
					this.boundary.y,
					this.boundary.bottom,
					this.boundary.top,
					0,
					this.boundary.height
				),
				this.boundary.width,
				this.boundary.height
			)
		);
		__classPrivateFieldSet$m(
			this,
			_powerOfTwo,
			Math.ceil(Math.log2(maximumDimension))
		);
		__classPrivateFieldSet$m(
			this,
			_bucketSize,
			1 << __classPrivateFieldGet$m(this, _powerOfTwo)
		);
		__classPrivateFieldSet$m(
			this,
			_columns$2,
			Math.ceil(
				this.boundary.width / 2 ** __classPrivateFieldGet$m(this, _powerOfTwo)
			)
		);
		__classPrivateFieldSet$m(
			this,
			_rows$2,
			Math.ceil(
				this.boundary.height / 2 ** __classPrivateFieldGet$m(this, _powerOfTwo)
			)
		);
		__classPrivateFieldSet$m(
			this,
			_buckets,
			new Array(
				__classPrivateFieldGet$m(this, _rows$2) *
					__classPrivateFieldGet$m(this, _columns$2)
			).fill(null)
		);
		for (let i = 0; i < __classPrivateFieldGet$m(this, _buckets).length; i++) {
			__classPrivateFieldGet$m(this, _buckets)[i] = new Set();
		}
	}
	query(boundary) {
		const result = [];
		if (this.boundary.completelyWithin(boundary)) {
			for (let i = 0; i < __classPrivateFieldGet$m(this, _buckets).length; i++) {
				for (let entry of __classPrivateFieldGet$m(this, _buckets)[i]) {
					result.push(entry);
				}
			}
			return result;
		}
		const unique = new Set();
		const ids = this.getHashIDs(boundary);
		for (let id of ids) {
			for (let entry of __classPrivateFieldGet$m(this, _buckets)[id]) {
				if (!unique.has(entry)) {
					unique.add(entry);
					result.push(entry);
				}
			}
		}
		return result;
	}
	add(entry) {
		if (!entry.boundary.intersects(this.boundary)) {
			return false;
		}
		const ids = this.getHashIDs(entry.boundary);
		for (let i of ids) {
			__classPrivateFieldGet$m(this, _buckets)[i].add(entry.identifier);
		}
		return ids.size > 0;
	}
	clear() {
		for (let i = 0; i < __classPrivateFieldGet$m(this, _buckets).length; i++) {
			__classPrivateFieldGet$m(this, _buckets)[i].clear();
		}
	}
	getHashIDs(boundary) {
		const validatedBoundary = new Rectangle(
			remapRange(
				boundary.x,
				this.boundary.left,
				this.boundary.right,
				0,
				this.boundary.width
			),
			remapRange(
				boundary.y,
				this.boundary.bottom,
				this.boundary.top,
				0,
				this.boundary.height
			),
			boundary.width,
			boundary.height
		);
		// Make sure that the query's bounds are within the partitioner's bounds.
		const constrainedBounds = _constrainRectangle(
			validatedBoundary,
			__classPrivateFieldGet$m(this, _validatedBoundary)
		);
		// Hash all corners of the validated query's bounds.
		const hashes = [
			this.getHash(constrainedBounds.left, constrainedBounds.top),
			this.getHash(constrainedBounds.right, constrainedBounds.top),
			this.getHash(constrainedBounds.right, constrainedBounds.bottom),
			this.getHash(constrainedBounds.left, constrainedBounds.bottom),
		];
		/// Ideally the dimensions of the validated query's bounds will be less than the partitioner's bucket size.
		/// However, this is not always the case. In order to handle all dimensions, we have to carefully divide the query bounds into smaller
		/// subsections. Each subsection needs to be the same size as the partitioner's bucket size for optimal guaranteed coverage.
		if (
			constrainedBounds.width > __classPrivateFieldGet$m(this, _bucketSize) ||
			constrainedBounds.height > __classPrivateFieldGet$m(this, _bucketSize)
		) {
			const totalRows = Math.ceil(
				constrainedBounds.height / __classPrivateFieldGet$m(this, _bucketSize)
			);
			const totalColumns = Math.ceil(
				constrainedBounds.width / __classPrivateFieldGet$m(this, _bucketSize)
			);
			for (let y = 0; y <= totalRows; y++) {
				for (let x = 0; x <= totalColumns; x++) {
					hashes.push(
						this.getHash(
							validatedBoundary.x +
								x * __classPrivateFieldGet$m(this, _bucketSize),
							validatedBoundary.y -
								y * __classPrivateFieldGet$m(this, _bucketSize)
						)
					);
				}
			}
		}
		return new Set(hashes.filter((value) => value >= 0));
	}
	getHash(x, y) {
		const position = _constrainPoint(
			{ x: x, y: y },
			__classPrivateFieldGet$m(this, _validatedBoundary)
		);
		// I just want to note that position is almost certainly a float, but the bitwise shifts just automatically truncate the operand into an integer.
		const row = position.x >> __classPrivateFieldGet$m(this, _powerOfTwo);
		const column = position.y >> __classPrivateFieldGet$m(this, _powerOfTwo);
		if (
			column < 0 ||
			column >= __classPrivateFieldGet$m(this, _columns$2) ||
			row < 0 ||
			row >= __classPrivateFieldGet$m(this, _rows$2)
		) {
			return -1;
		}
		return __classPrivateFieldGet$m(this, _columns$2) * column + row;
	}
}
(_validatedBoundary = new WeakMap()),
	(_powerOfTwo = new WeakMap()),
	(_bucketSize = new WeakMap()),
	(_columns$2 = new WeakMap()),
	(_rows$2 = new WeakMap()),
	(_buckets = new WeakMap());

var __classPrivateFieldSet$n =
	(undefined && undefined.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet$n =
	(undefined && undefined.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _capacity,
	_divided,
	_insertionIndex,
	_entries,
	_topLeft,
	_topRight,
	_bottomRight,
	_bottomLeft;
/**
 * An implementation of a Partitioner that uses a recursive tree structure to store and retrieve IPartitionable entries.
 */
class Quadtree extends Partitioner {
	/**
	 * Creates an implementation of a Partitioner that uses a recursive tree structure to store and retrieve IPartitionable entries.
	 * @param boundary The area that the partitioner will cover.
	 * @param capacity The total amount of entries that exist in a node before overflowing into a new tree.
	 */
	constructor(boundary, capacity) {
		super(boundary);
		_capacity.set(this, void 0);
		_divided.set(this, void 0);
		_insertionIndex.set(this, void 0);
		_entries.set(this, void 0);
		_topLeft.set(this, void 0);
		_topRight.set(this, void 0);
		_bottomRight.set(this, void 0);
		_bottomLeft.set(this, void 0);
		__classPrivateFieldSet$n(this, _capacity, capacity);
		__classPrivateFieldSet$n(this, _divided, false);
		__classPrivateFieldSet$n(this, _insertionIndex, 0);
		//@ts-ignore
		__classPrivateFieldSet$n(
			this,
			_entries,
			new Array(__classPrivateFieldGet$n(this, _capacity)).fill(null)
		);
		__classPrivateFieldSet$n(this, _topLeft, null);
		__classPrivateFieldSet$n(this, _topRight, null);
		__classPrivateFieldSet$n(this, _bottomRight, null);
		__classPrivateFieldSet$n(this, _bottomLeft, null);
	}
	query(boundary) {
		const result = [];
		if (this.boundary.completelyWithin(boundary)) {
			for (let i = 0; i < __classPrivateFieldGet$n(this, _entries).length; i++) {
				if (__classPrivateFieldGet$n(this, _entries)[i] === null) {
					continue;
				}
				result.push(__classPrivateFieldGet$n(this, _entries)[i].identifier);
			}
		} else {
			for (let i = 0; i < __classPrivateFieldGet$n(this, _entries).length; i++) {
				if (__classPrivateFieldGet$n(this, _entries)[i] === null) {
					continue;
				}
				if (
					boundary.intersects(
						__classPrivateFieldGet$n(this, _entries)[i].boundary
					)
				) {
					result.push(__classPrivateFieldGet$n(this, _entries)[i].identifier);
				}
			}
		}
		if (!__classPrivateFieldGet$n(this, _divided)) {
			return result;
		}
		//@ts-ignore
		result.push(...__classPrivateFieldGet$n(this, _topLeft).query(boundary));
		//@ts-ignore
		result.push(...__classPrivateFieldGet$n(this, _topRight).query(boundary));
		//@ts-ignore
		result.push(...__classPrivateFieldGet$n(this, _bottomRight).query(boundary));
		//@ts-ignore
		result.push(...__classPrivateFieldGet$n(this, _bottomLeft).query(boundary));
		return result;
	}
	add(entry) {
		var _a;
		if (!entry.boundary.intersects(this.boundary)) {
			return false;
		}
		if (
			__classPrivateFieldGet$n(this, _insertionIndex) <
			__classPrivateFieldGet$n(this, _capacity)
		) {
			__classPrivateFieldGet$n(this, _entries)[
				(__classPrivateFieldSet$n(
					this,
					_insertionIndex,
					(_a = +__classPrivateFieldGet$n(this, _insertionIndex)) + 1
				),
				_a)
			] = entry;
			return true;
		} else {
			if (!__classPrivateFieldGet$n(this, _divided)) {
				this.subdivide();
			}
			if (
				//@ts-ignore
				__classPrivateFieldGet$n(this, _topLeft).insert(entry) ||
				//@ts-ignore
				__classPrivateFieldGet$n(this, _topRight).insert(entry) ||
				//@ts-ignore
				__classPrivateFieldGet$n(this, _bottomRight).insert(entry) ||
				//@ts-ignore
				__classPrivateFieldGet$n(this, _bottomLeft).insert(entry)
			) {
				return true;
			}
		}
		return false;
	}
	clear() {
		if (__classPrivateFieldGet$n(this, _divided)) {
			//@ts-ignore
			__classPrivateFieldGet$n(this, _topLeft).clear();
			//@ts-ignore
			__classPrivateFieldGet$n(this, _topRight).clear();
			//@ts-ignore
			__classPrivateFieldGet$n(this, _bottomRight).clear();
			//@ts-ignore
			__classPrivateFieldGet$n(this, _bottomLeft).clear();
			__classPrivateFieldSet$n(this, _topLeft, null);
			__classPrivateFieldSet$n(this, _topRight, null);
			__classPrivateFieldSet$n(this, _bottomRight, null);
			__classPrivateFieldSet$n(this, _bottomLeft, null);
		}
		__classPrivateFieldSet$n(this, _divided, false);
		__classPrivateFieldSet$n(this, _insertionIndex, 0);
		//@ts-ignore
		__classPrivateFieldGet$n(this, _entries).fill(null);
	}
	subdivide() {
		const width = this.boundary.width * 0.5;
		const height = this.boundary.height * 0.5;
		__classPrivateFieldSet$n(
			this,
			_topLeft,
			new Quadtree(
				new Rectangle(this.boundary.x, this.boundary.y, width, height),
				__classPrivateFieldGet$n(this, _capacity)
			)
		);
		__classPrivateFieldSet$n(
			this,
			_topRight,
			new Quadtree(
				new Rectangle(this.boundary.x + width, this.boundary.y, width, height),
				__classPrivateFieldGet$n(this, _capacity)
			)
		);
		__classPrivateFieldSet$n(
			this,
			_bottomRight,
			new Quadtree(
				new Rectangle(
					this.boundary.x + width,
					this.boundary.y - height,
					width,
					height
				),
				__classPrivateFieldGet$n(this, _capacity)
			)
		);
		__classPrivateFieldSet$n(
			this,
			_bottomLeft,
			new Quadtree(
				new Rectangle(this.boundary.x, this.boundary.y - height, width, height),
				__classPrivateFieldGet$n(this, _capacity)
			)
		);
		__classPrivateFieldSet$n(this, _divided, true);
	}
}
(_capacity = new WeakMap()),
	(_divided = new WeakMap()),
	(_insertionIndex = new WeakMap()),
	(_entries = new WeakMap()),
	(_topLeft = new WeakMap()),
	(_topRight = new WeakMap()),
	(_bottomRight = new WeakMap()),
	(_bottomLeft = new WeakMap());

exports.AttributeElement = AttributeElement;
exports.AttributeSchema = AttributeSchema;
exports.AttributeType = ATTRIBUTE_TYPES;
exports.Bin = Bin;
exports.Camera = Camera;
exports.CollisionHelper = collisionHelper;
exports.Color = Color;
exports.DrawMode = DRAW_MODES;
exports.Effect = Effect;
exports.GeometryData = GeometryData;
exports.IndexBuffer = IndexBuffer;
exports.InputHandler = InputHandler;
exports.InputProfile = InputProfile;
exports.LineSegment = LineSegment;
exports.MathExt = mathExt;
exports.Matrix = Matrix;
exports.Matrix4 = Matrix4;
exports.Mesh = Mesh;
exports.Palettes = palettes;
exports.Partitioner = Partitioner;
exports.Polygon = Polygon;
exports.PolygonEffect = PolygonEffect;
exports.Quad = Quad;
exports.Quadtree = Quadtree;
exports.Random = Random;
exports.RandomHelper = randomHelper;
exports.Rectangle = Rectangle;
exports.Scene = Scene;
exports.SparseSet = SparseSet;
exports.Sprite = Sprite;
exports.SpriteEffect = SpriteEffect;
exports.Texture2D = Texture2D;
exports.Theater = Theater;
exports.Vector2 = Vector2;
exports.Vector3 = Vector3;
exports.VertexBuffer = VertexBuffer;
exports.VertexUsage = VERTEX_USAGE;
