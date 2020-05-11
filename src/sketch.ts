import * as WebGL from "./graphics/webGL.js";
import Graphics from "./graphics/graphics.js";

export default class Sketch {
	public readonly parent: HTMLElement;
	public readonly            canvas: HTMLCanvasElement;
	public readonly graphics: Graphics;
	public loop: boolean;

	#initialized: boolean;

	constructor(id: string) {
		const element =               document.getElementById(id);

		if (element === null) {
			throw new TypeError(`Could not find an element with an id of '${id}'.`);
		}

		this.parent = element;
		this.canvas = document
		.createElement("canvas");
		this.parent.appendChild(this.canvas);
				this.canvas.id = `${id}-canvas`;
		this.canvas.width = 400;
		this.canvas.height = 400;

		this.graphics = new Graphics(WebGL.getWebGLContext(this.canvas));

		this.#initialized = false;
		this.loop = true;

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

		this.update();
		this.draw();

		if (this.loop) {
			window.requestAnimationFrame(this.run.bind(this));
		}
	}

							public initialize() {}

							public update() {}

							public draw() {}
}
