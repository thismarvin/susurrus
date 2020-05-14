import * as WebGL from "./graphics/webGL.js";
import Graphics from "./graphics/graphics.js";

export default class Sketch {
	public readonly parent: HTMLElement;
	public readonly canvas: HTMLCanvasElement;
	public readonly graphics: Graphics;
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
	}

	public run() {
		if (!this.#initialized) {
			this.initialize();
			this.#initialized = true;
		}

		this.main(0);
	}

	public initialize() {}

	// eslint-disable-next-line no-unused-vars
	public update(deltaTime: number) {}

	// eslint-disable-next-line no-unused-vars
	public draw(deltaTime: number) {}

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
