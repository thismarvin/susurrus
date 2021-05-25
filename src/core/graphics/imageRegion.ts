export default class ImageRegion {
	public x: number;
	public y: number;
	public width: number;
	public height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.width = Math.floor(width);
		this.height = Math.floor(height);
	}
}
