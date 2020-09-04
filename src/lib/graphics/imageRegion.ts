export default class ImageRegion {
	public readonly x: number;
	public readonly y: number;
	public readonly width: number;
	public readonly height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.width = Math.floor(width);
		this.height = Math.floor(height);

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
}
