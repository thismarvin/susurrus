import * as V3H from "./vector3Helper.js";

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
		return V3H.length(this);
	}

	public lengthSquared() {
		return V3H.lengthSquared(this);
	}

	public normalize() {
		const temp = V3H.normalize(this);
		this.copy(temp);
	}

	public copy(a: Vector3) {
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
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
