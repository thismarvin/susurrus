import Matrix4 from "./matrix4.js";
// eslint-disable-next-line no-unused-vars
import Vector3 from "./vector3.js";
import * as V3H from "./vector3Helper.js";

export function identity() {
	return new Matrix4(_getIdentityData());
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

	temp[0] = 2 / width;
	temp[5] = 2 / height;
	temp[10] = 1 / (near - far);
	temp[14] = near / (near - far);

	return new Matrix4(temp);

	// matrix.set(0, 0, 2 / width);
	// matrix.set(1, 1, 2 / height);
	// matrix.set(2, 2, -2 / (far - near));
	// matrix.set(0, 3, -1);
	// matrix.set(1, 3, -1);
	// matrix.set(2, 3, -(far + near) / (far - near));
}

export function createOrthographic2(
	left: number,
	right: number,
	bottom: number,
	top: number,
	near: number,
	far: number
) {
	const temp = new Array(16).fill(0);

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

export function createLookAt(
	cameraPosition: Vector3,
	cameraTarget: Vector3,
	cameraUp: Vector3
) {
	const a = V3H.subtract(cameraPosition, cameraTarget);
	a.normalize();

	const b = V3H.cross(cameraUp, a);
	b.normalize();

	const c = V3H.cross(a, b);

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

	temp[12] = -V3H.dot(b, cameraPosition);
	temp[13] = -V3H.dot(c, cameraPosition);
	temp[14] = -V3H.dot(a, cameraPosition);

	return new Matrix4(temp);
}

function _getIdentityData() {
	return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}
