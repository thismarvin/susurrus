// eslint-disable-next-line no-unused-vars
import * as Graphics from "../lib/graphics.js";
// eslint-disable-next-line no-unused-vars
import * as Maths from "../lib/maths.js";
// eslint-disable-next-line no-unused-vars
import Theater from "./theater.js";
import Camera from "./camera.js";

export default abstract class Scene {
	public readonly name: string;
	public readonly theater: Theater;

	public camera: Camera;
	public bounds: Maths.Rectangle;

	constructor(name: string, theater: Theater) {
		this.name = name;
		this.theater = theater;

		// TODO This camera and bounds stuff is kinda jank. So it's officially temporary for now.
		const graphics = this.theater.graphics;
		this.camera = new Camera(
			graphics.gl.canvas.width / graphics.scale,
			graphics.gl.canvas.height / graphics.scale
		);

		this.bounds = new Maths.Rectangle(
			0,
			0,
			graphics.gl.canvas.width / graphics.scale,
			graphics.gl.canvas.height / graphics.scale
		);

		Object.defineProperty(this, "name", {
			writable: false,
		});
		Object.defineProperty(this, "theater", {
			writable: false,
		});
	}

	public onEnter() {}
	public onExit() {}

	public abstract update(deltaTime: number): void;
	public abstract draw(
		graphics: Graphics.GraphicsManager,
		deltaTime: number
	): void;
}
