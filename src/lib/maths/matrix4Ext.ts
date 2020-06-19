import Matrix4 from "./matrix4.js";
// eslint-disable-next-line no-unused-vars
import Vector3 from "./vector3.js";
import * as Vector3Func from "./vector3Ext.js";

export function identity() {
	return new Matrix4(_getIdentityData());
}

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

//#region Math
export function add(a: Matrix4, b: Matrix4) {
	const temp = a.data.slice(0);

	for (let i = 0; i < temp.length; i++) {
		temp[i] += b.data[i];
	}

	return new Matrix4(temp);
}

export function subtract(a: Matrix4, b: Matrix4) {
	const temp = a.data.slice(0);

	for (let i = 0; i < temp.length; i++) {
		temp[i] -= b.data[i];
	}

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
	const temp = a.data.slice(0);

	for (let i = 0; i < temp.length; i++) {
		temp[i] += scalar;
	}

	return new Matrix4(temp);
}

export function subtractScalar(a: Matrix4, scalar: number) {
	const temp = a.data.slice(0);

	for (let i = 0; i < temp.length; i++) {
		temp[i] -= scalar;
	}

	return new Matrix4(temp);
}

export function multiplyScalar(a: Matrix4, scalar: number) {
	const temp = a.data.slice(0);

	for (let i = 0; i < temp.length; i++) {
		temp[i] *= scalar;
	}

	return new Matrix4(temp);
}

export function divideScalar(a: Matrix4, scalar: number) {
	const temp = 1 / scalar;

	return multiplyScalar(a, temp);
}
//#endregion

//#region Affine Transformations
export function createRotationX(angle: number) {
	const temp = _getIdentityData();

	temp[5] = Math.cos(angle);
	temp[6] = Math.sin(angle);
	temp[9] = -Math.sin(angle);
	temp[10] = Math.cos(angle);

	return new Matrix4(temp);
}

export function createRotationY(angle: number) {
	const temp = _getIdentityData();

	temp[0] = Math.cos(angle);
	temp[2] = -Math.sin(angle);
	temp[8] = Math.sin(angle);
	temp[10] = Math.cos(angle);

	return new Matrix4(temp);
}

export function createRotationZ(angle: number) {
	const temp = _getIdentityData();

	temp[0] = Math.cos(angle);
	temp[1] = Math.sin(angle);
	temp[4] = -Math.sin(angle);
	temp[5] = Math.cos(angle);

	return new Matrix4(temp);
}

export function createTranslation(x: number, y: number, z: number) {
	const temp = _getIdentityData();

	temp[12] = x;
	temp[13] = y;
	temp[14] = z;

	return new Matrix4(temp);
}

export function createScale(x: number, y: number, z: number) {
	const temp = _getIdentityData();

	temp[0] = x;
	temp[5] = y;
	temp[10] = z;

	return new Matrix4(temp);
}

export function createOrthographic(
	width: number,
	height: number,
	near: number,
	far: number
) {
	const temp = _getIdentityData();
	const fn = 1 / (far - near);

	temp[0] = 2 / width;
	temp[5] = 2 / height;
	temp[10] = -2 * fn;
	temp[14] = -(far + near) * fn;

	return new Matrix4(temp);
}

export function createOrthographicOffCenter(
	left: number,
	right: number,
	bottom: number,
	top: number,
	near: number,
	far: number
) {
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

export function createPerspective(
	width: number,
	height: number,
	near: number,
	far: number
) {
	const temp = _getEmptyData();
	const fn = 1 / (far - near);

	temp[0] = (2 * near) / width;
	temp[5] = (2 * near) / height;
	temp[10] = -(far + near) * fn;
	temp[11] = -1;
	temp[14] = -2 * far * near * fn;

	return new Matrix4(temp);
}

export function createPerspectiveOffCenter(
	left: number,
	right: number,
	bottom: number,
	top: number,
	near: number,
	far: number
) {
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

export function createLookAt(
	cameraPosition: Vector3,
	cameraTarget: Vector3,
	cameraUp: Vector3
) {
	const a = Vector3Func.subtract(cameraPosition, cameraTarget);
	a.normalize();

	const b = Vector3Func.cross(cameraUp, a);
	b.normalize();

	const c = Vector3Func.cross(a, b);

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

	temp[12] = -Vector3Func.dot(b, cameraPosition);
	temp[13] = -Vector3Func.dot(c, cameraPosition);
	temp[14] = -Vector3Func.dot(a, cameraPosition);

	return new Matrix4(temp);
}
//#endregion

function _getEmptyData() {
	return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function _getIdentityData() {
	return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}
