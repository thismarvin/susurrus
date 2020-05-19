import * as WebGL from "./graphics/webGL.js";
import Graphics from "./graphics/graphics.js";
import SceneManager from "./ecs/sceneManager.js";

export default class Theater {
	public readonly parent: HTMLElement;
	public readonly canvas: HTMLCanvasElement;
	public readonly graphics: Graphics;
	public readonly sceneManager: SceneManager;

	public loop: boolean;

	public get totalElapsedTime() {
		return this.#totalElapsedTime;
	}

	#initialized: boolean;
	#totalElapsedTime: number;

	constructor(id: string) {
		const element = document.getElementById(id);

		if (element === null) {
			throw new TypeError(`Could not find an element with an id of '${id}'.`);
		}

		this.parent = element;
		this.canvas = document.createElement("canvas");
		this.parent.appendChild(this.canvas);
		this.canvas.id = `${id}-canvas`;

		this.graphics = new Graphics(WebGL.getWebGLContext(this.canvas));

		this.sceneManager = new SceneManager();

		this.loop = true;
		this.#initialized = false;
		this.#totalElapsedTime = 0;

		Object.defineProperty(this, "parent", {
			writable: false,
		});
		Object.defineProperty(this, "canvas", {
			writable: false,
		});
		Object.defineProperty(this, "graphics", {
			writable: false,
		});
		Object.defineProperty(this, "sceneManager", {
			writable: false,
		});
	}

	public run() {
		if (!this.#initialized) {
			this.initialize();
			this.#initialized = true;
		}

		this.main(0);
	}

	public initialize() {}

	public update(deltaTime: number) {
		this.sceneManager.update(deltaTime);
	}

	public draw(deltaTime: number) {
		this.sceneManager.draw(this.graphics, deltaTime);
	}

	private main(timeStamp: number) {
		let deltaTime = (timeStamp - this.#totalElapsedTime) / 1000;
		if (Number.isNaN(deltaTime)) {
			deltaTime = 0;
		}
		this.#totalElapsedTime = timeStamp;

		this.update(deltaTime);
		this.draw(deltaTime);

		if (this.loop) {
			window.requestAnimationFrame(this.main.bind(this));
		}
	}
}
