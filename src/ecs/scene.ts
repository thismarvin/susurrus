// eslint-disable-next-line no-unused-vars
import Graphics from "../graphics/graphics.js";
import Camera from "../utilities/camera.js";
import Rectangle from "../maths/rectangle.js";

export default abstract class Scene {
	public readonly name: string;
	public camera: Camera;
	public bounds: Rectangle;

	constructor(name: string, graphics: Graphics) {
		this.name = name;

		this.camera = new Camera(
			graphics.gl.canvas.width / graphics.scale,
			graphics.gl.canvas.height / graphics.scale
		);

		this.bounds = new Rectangle(
			0,
			0,
			graphics.gl.canvas.width / graphics.scale,
			graphics.gl.canvas.height / graphics.scale
		);

		Object.defineProperty(this, "name", {
			writable: false,
		});
	}

	public abstract update(deltaTime: number): void;
	public abstract draw(graphics: Graphics, deltaTime: number): void;
}
