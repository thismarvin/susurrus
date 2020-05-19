// eslint-disable-next-line no-unused-vars
import Graphics from "../graphics/graphics.js";
// eslint-disable-next-line no-unused-vars
import SceneManager from "./sceneManager.js";
import Camera from "../utilities/camera.js";
import Rectangle from "../maths/rectangle.js";

export default abstract class Scene {
	public readonly name: string;
	public readonly sceneManager: SceneManager;
	public camera: Camera;
	public bounds: Rectangle;

	constructor(name: string, graphics: Graphics, sceneManager: SceneManager) {
		this.name = name;
		this.sceneManager = sceneManager;

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
		Object.defineProperty(this, "sceneManager", {
			writable: false,
		});
	}

	public abstract onEnter(): void;
	public abstract onExit(): void;
	public abstract update(deltaTime: number): void;
	public abstract draw(graphics: Graphics, deltaTime: number): void;
}
