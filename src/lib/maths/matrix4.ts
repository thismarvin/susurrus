import Vector3 from "./vector3.js";

function _getEmptyData() {
	return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function _getIdentityData() {
	return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

export default class Matrix4 {
	public get rows() {
		return this.#rows;
	}
	public get columns() {
		return this.#columns;
	}
	public get data() {
		return this.#data;
	}

	public static get IDENTITY() {
		return _identity;
	}

	#rows: number;
	#columns: number;
	#data: number[];

	constructor(data?: number[]) {
		this.#rows = 4;
		this.#columns = 4;
		this.#data = new Array(this.#rows * this.#columns).fill(0);

		if (data !== undefined) {
			this.setData(data);
		}
	}

	public setData(data: number[]) {
		if (data.length !== this.#rows * this.#columns) {
			throw new TypeError(
				"The given data does not match the dimensions of the matrix."
			);
		}

		this.#data = data.slice(0);
	}

	public get(x: number, y: number) {
		return this.#data[this.#columns * y + x];
	}

	public set(x: number, y: number, value: number) {
		this.#data[this.#columns * y + x] = value;
	}

	public transpose() {
		const temp = _getEmptyData();

		temp[0] = this.#data[0];
		temp[1] = this.#data[4];
		temp[2] = this.#data[8];
		temp[3] = this.#data[12];
		temp[4] = this.#data[1];
		temp[5] = this.#data[5];
		temp[6] = this.#data[9];
		temp[7] = this.#data[13];
		temp[8] = this.#data[2];
		temp[9] = this.#data[6];
		temp[10] = this.#data[10];
		temp[11] = this.#data[14];
		temp[12] = this.#data[3];
		temp[13] = this.#data[7];
		temp[14] = this.#data[11];
		temp[15] = this.#data[15];

		this.#data = temp;
	}

	//#region Math
	public static add(a: Matrix4, b: Matrix4) {
		const temp = a.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] += b.data[i];
		}

		return new Matrix4(temp);
	}

	public static subtract(a: Matrix4, b: Matrix4) {
		const temp = a.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] -= b.data[i];
		}

		return new Matrix4(temp);
	}

	public static multiply(a: Matrix4, b: Matrix4) {
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

	public static addScalar(a: Matrix4, scalar: number) {
		const temp = a.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] += scalar;
		}

		return new Matrix4(temp);
	}

	public static subtractScalar(a: Matrix4, scalar: number) {
		const temp = a.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] -= scalar;
		}

		return new Matrix4(temp);
	}

	public static multiplyScalar(a: Matrix4, scalar: number) {
		const temp = a.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] *= scalar;
		}

		return new Matrix4(temp);
	}

	public static divideScalar(a: Matrix4, scalar: number) {
		const temp = 1 / scalar;

		return Matrix4.multiplyScalar(a, temp);
	}
	//#endregion

	//#region Affine Transformations
	public static createRotationX(angle: number) {
		const temp = _getIdentityData();

		temp[5] = Math.cos(angle);
		temp[6] = Math.sin(angle);
		temp[9] = -Math.sin(angle);
		temp[10] = Math.cos(angle);

		return new Matrix4(temp);
	}

	public static createRotationY(angle: number) {
		const temp = _getIdentityData();

		temp[0] = Math.cos(angle);
		temp[2] = -Math.sin(angle);
		temp[8] = Math.sin(angle);
		temp[10] = Math.cos(angle);

		return new Matrix4(temp);
	}

	public static createRotationZ(angle: number) {
		const temp = _getIdentityData();

		temp[0] = Math.cos(angle);
		temp[1] = Math.sin(angle);
		temp[4] = -Math.sin(angle);
		temp[5] = Math.cos(angle);

		return new Matrix4(temp);
	}

	public static createTranslation(x: number, y: number, z: number) {
		const temp = _getIdentityData();

		temp[12] = x;
		temp[13] = y;
		temp[14] = z;

		return new Matrix4(temp);
	}

	public static createScale(x: number, y: number, z: number) {
		const temp = _getIdentityData();

		temp[0] = x;
		temp[5] = y;
		temp[10] = z;

		return new Matrix4(temp);
	}

	public static createOrthographic(
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

	public static createOrthographicOffCenter(
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

	public static createPerspective(
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

	public static createPerspectiveOffCenter(
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

	public static createLookAt(
		cameraPosition: Vector3,
		cameraTarget: Vector3,
		cameraUp: Vector3
	) {
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
	//#endregion
}

const _identity = new Matrix4(_getIdentityData());
