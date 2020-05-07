import Vector3 from "./vector3.mjs";

export default class Matrix {
	constructor(data) {
		this.rows = 4;
		this.columns = 4;

		this.data = new Array(this.rows * this.columns).fill(0);

		if (data) {
			this.setData(data);
		}
	}

	get(x, y) {
		return this.data[this.columns * y + x];
	}

	/**
	 *
	 * @param {Array} data
	 */
	setData(data) {
		if (data.length !== this.rows * this.columns) {
			throw new Error("The data does not match the dimensions of the matrix.");
		}

		this.data = data;
	}

	set(x, y, value) {
		this.data[this.columns * y + x] = value;
	}

	toString() {
		let string = "";

		for (let i = 0; i < this.data.length; i += this.columns) {
			string += `( ${this.data[i]}`;
			for (let j = 1; j < this.columns; j++) {
				string += ` ${this.data[i + j]}`;
			}

			string += " )";

			if (i !== this.data.length - this.columns) {
				string += " ";
			}
		}

		return string;
	}

	static multiply(a, b) {
		const matrix = new Matrix();

		for (let aY = 0; aY < a.rows; aY++) {
			for (let aX = 0; aX < a.columns; aX++) {
				for (let bX = 0; bX < b.columns; bX++) {
					matrix.set(
						bX,
						aY,
						matrix.get(bX, aY) + a.get(aX, aY) * b.get(bX, aX)
					);
				}
			}
		}

		return matrix;
	}

	static identity() {
		return new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	}

	static createRotationZ(angle) {
		// if (!angle) {
		//     throw new Error();
		// }

		const matrix = Matrix.identity();

		matrix.set(0, 0, Math.cos(angle));
		matrix.set(1, 0, Math.sin(angle));
		matrix.set(0, 1, -Math.sin(angle));
		matrix.set(1, 1, Math.cos(angle));

		return matrix;
	}

	static createTranslation(x, y, z) {
		const matrix = Matrix.identity();

		if (x) matrix.set(0, 3, x);
		if (y) matrix.set(1, 3, y);
		if (z) matrix.set(2, 3, z);

		return matrix;
	}

	static createOrthographic(width, height, near, far) {
		// if (!width || !height || !near || !far) {
		//     throw new Error();
		// }

		const matrix = Matrix.identity();

		// matrix.set(0, 0, 2 / width);
		// matrix.set(1, 1, 2 / height);
		// matrix.set(2, 2, -2 / (far - near));
		// matrix.set(0, 3, -1);
		// matrix.set(1, 3, -1);
		// matrix.set(2, 3, -(far + near) / (far - near));

		matrix.set(0, 0, 2 / width);
		matrix.set(1, 1, 2 / height);
		matrix.set(2, 2, 1 / (near - far));
		matrix.set(2, 3, near / (near - far));

		return matrix;
	}

	static createLookAt(cameraPosition, cameraTarget, cameraUp) {
		const a = Vector3.subtract(cameraPosition, cameraTarget);
		a.normalize();

		const b = Vector3.cross(cameraUp, a);
		b.normalize();

		const c = Vector3.cross(a, b);

		const matrix = Matrix.identity();

		matrix.set(0, 0, b.x);
		matrix.set(1, 0, c.x);
		matrix.set(2, 0, a.x);

		matrix.set(0, 1, b.y);
		matrix.set(1, 1, c.y);
		matrix.set(2, 1, a.y);

		matrix.set(0, 2, b.z);
		matrix.set(1, 2, c.z);
		matrix.set(2, 2, a.z);

		matrix.set(0, 3, -Vector3.dot(b, cameraPosition));
		matrix.set(1, 3, -Vector3.dot(c, cameraPosition));
		matrix.set(2, 3, -Vector3.dot(a, cameraPosition));

		return matrix;
	}
}
