import Matrix from "./matrix.js";

export function transpose(a: Matrix) {
	const temp = new Array(a.rows * a.columns).fill(0);
	const newRows = a.columns;
	const newColumns = a.rows;

	for (let y = 0; y < newRows; y++) {
		for (let x = 0; x < newColumns; x++) {
			temp[newColumns * y + x] = a.data[a.columns * x + y];
		}
	}

	return new Matrix(newRows, newColumns, temp);
}
//#region Math
export function add(a: Matrix, b: Matrix) {
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

export function subtract(a: Matrix, b: Matrix) {
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

export function multiply(a: Matrix, b: Matrix) {
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

export function addScalar(a: Matrix, scalar: number) {
	const temp = a.data.slice(0);
	for (let i = 0; i < a.data.length; i++) {
		temp[i] += scalar;
	}

	return new Matrix(a.rows, a.columns, temp);
}

export function subtractScalar(a: Matrix, scalar: number) {
	const temp = a.data.slice(0);
	for (let i = 0; i < a.data.length; i++) {
		temp[i] -= scalar;
	}

	return new Matrix(a.rows, a.columns, temp);
}

export function multiplyScalar(a: Matrix, scalar: number) {
	const temp = a.data.slice(0);
	for (let i = 0; i < a.data.length; i++) {
		temp[i] *= scalar;
	}

	return new Matrix(a.rows, a.columns, temp);
}

export function divideScalar(a: Matrix, scalar: number) {
	const temp = 1 / scalar;

	return multiplyScalar(a, temp);
}
//#endregion
