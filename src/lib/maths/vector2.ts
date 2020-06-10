import * as Vector2Func from "./vector2Func.js";

export default class Vector2 {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public length() {
		return Vector2Func.length(this);
	}

	public lengthSquared() {
		return Vector2Func.lengthSquared(this);
	}

	public normalize() {
		const temp = Vector2Func.normalize(this);
		this.copy(temp);
	}

	public copy(vector: Vector2) {
		this.x = vector.x;
		this.y = vector.y;
	}

	public clone() {
		return new Vector2(this.x, this.y);
	}

	public toArray() {
		return [this.x, this.y];
	}

	public toString() {
		return `(${this.x}, ${this.y})`;
	}
}
