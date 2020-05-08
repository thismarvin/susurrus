import DynamicMatrix from "./dynamicMatrix.js";
import Vector3 from "./vector3.js";

export default class Matrix extends DynamicMatrix {
	constructor(data: number[]) {
		super(4, 4, data);
	}

	static identity() {
		return new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	}

	static createRotationZ(angle: number) {
		const matrix = Matrix.identity();

		matrix.set(0, 0, Math.cos(angle));
		matrix.set(1, 0, Math.sin(angle));
		matrix.set(0, 1, -Math.sin(angle));
		matrix.set(1, 1, Math.cos(angle));

		return matrix;
	}

	static createTranslation(x: number, y: number, z: number) {
		const matrix = Matrix.identity();

		if (x) matrix.set(0, 3, x);
		if (y) matrix.set(1, 3, y);
		if (z) matrix.set(2, 3, z);

		return matrix;
	}

	static createOrthographic(
		width: number,
		height: number,
		near: number,
		far: number
	) {
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

	static createLookAt(
		cameraPosition: Vector3,
		cameraTarget: Vector3,
		cameraUp: Vector3
	) {
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
