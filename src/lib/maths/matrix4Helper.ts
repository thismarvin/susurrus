import Matrix4 from "./matrix4.js";

export function transpose(a: Matrix4) {
	const temp = new Array(16).fill(0);

	temp[0] = a.data[0];
	temp[1] = a.data[4];
	temp[2] = a.data[8];
	temp[3] = a.data[12];
	temp[4] = a.data[1];
	temp[5] = a.data[5];
	temp[6] = a.data[9];
	temp[7] = a.data[13];
	temp[8] = a.data[2];
	temp[9] = a.data[6];
	temp[10] = a.data[10];
	temp[11] = a.data[14];
	temp[12] = a.data[3];
	temp[13] = a.data[7];
	temp[14] = a.data[11];
	temp[15] = a.data[15];

	return new Matrix4(temp);
}

export function add(a: Matrix4, b: Matrix4) {
	const temp = a.data.map((value, index) => value + b.data[index]);
	return new Matrix4(temp);
}

export function subtract(a: Matrix4, b: Matrix4) {
	const temp = a.data.map((value, index) => value - b.data[index]);
	return new Matrix4(temp);
}

export function multiply(a: Matrix4, b: Matrix4) {
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

export function addScalar(a: Matrix4, scalar: number) {
	const temp = a.data.map((value) => value + scalar);
	return new Matrix4(temp);
}

export function subtractScalar(a: Matrix4, scalar: number) {
	const temp = a.data.map((value) => value - scalar);
	return new Matrix4(temp);
}

export function multiplyScalar(a: Matrix4, scalar: number) {
	const temp = a.data.map((value) => value * scalar);
	return new Matrix4(temp);
}

export function divideScalar(a: Matrix4, scalar: number) {
	const temp = 1 / scalar;
	return multiplyScalar(a, temp);
}
