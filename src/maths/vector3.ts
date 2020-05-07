export default class Vector3 {
	public x: number;
	public y: number;
	public z: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	multiply(value: number) {
		this.x *= value;
		this.y *= value;
		this.z *= value;
	}

	divide(value: number) {
		this.x /= value;
		this.y /= value;
		this.z /= value;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	normalize() {
		const magnitude = this.length();
		if (magnitude > 0) {
			this.divide(magnitude);
		}
	}

	toArray() {
		return [this.x, this.y, this.z];
	}

	static dot(a: Vector3, b: Vector3) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	static cross(a: Vector3, b: Vector3) {
		const x = a.y * b.z - b.y * a.z;
		const y = -(a.x * b.z - b.x * a.z);
		const z = a.x * b.y - b.x * a.y;

		return new Vector3(x, y, z);
	}

	static subtract(a: Vector3, b: Vector3) {
		const x = a.x - b.x;
		const y = a.y - b.y;
		const z = a.z - b.z;

		return new Vector3(x, y, z);
	}
}
