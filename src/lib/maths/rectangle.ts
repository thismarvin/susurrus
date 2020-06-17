export default class Rectangle {
	public readonly x: number;
	public readonly y: number;
	public readonly width: number;
	public readonly height: number;

	public get left() {
		return this.x;
	}
	public get top() {
		return this.y;
	}
	public get right() {
		return this.x + this.width;
	}
	public get bottom() {
		return this.y - this.height;
	}

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		Object.defineProperty(this, "x", {
			writable: false,
		});
		Object.defineProperty(this, "y", {
			writable: false,
		});
		Object.defineProperty(this, "width", {
			writable: false,
		});
		Object.defineProperty(this, "height", {
			writable: false,
		});
	}

	public intersects(rectangle: Rectangle) {
		return (
			this.left < rectangle.right &&
			this.right > rectangle.left &&
			this.top > rectangle.bottom &&
			this.bottom < rectangle.top
		);
	}
}
