import * as Vector3Func from "./vector3Ext.js";

export default class Vector3 {
	public x: number;
	public y: number;
	public z: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public length() {
		return Vector3Func.length(this);
	}

	public lengthSquared() {
		return Vector3Func.lengthSquared(this);
	}

	public normalize() {
		const temp = Vector3Func.normalize(this);
		this.copy(temp);
	}

	public copy(vector: Vector3) {
		this.x = vector.x;
		this.y = vector.y;
		this.z = vector.z;
	}

	public clone() {
		return new Vector3(this.x, this.y, this.z);
	}

	public toArray() {
		return [this.x, this.y, this.z];
	}

	public toString() {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}
}
