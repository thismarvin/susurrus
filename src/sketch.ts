import * as WebGL from "./graphics/webGL.js";
import Graphics from "./graphics/graphics.js";

export default class Sketch {
	public readonly parent: HTMLElement;
	public readonly canvas: HTMLCanvasElement;
	public readonly graphics: Graphics;
	public running: boolean;

	private initialized: boolean;

	constructor(id: string) {
		const element = document.getElementById(id);

		if (element === null) {
			throw new TypeError(`Could not find an element with an id of '${id}'.`);
		}

		this.parent = element;
		this.canvas = document.createElement("canvas");
		this.parent.appendChild(this.canvas);
		this.canvas.id = `${id}-canvas`;
		this.canvas.width = 400;
		this.canvas.height = 400;

		this.graphics = new Graphics(WebGL.getWebGLContext(this.canvas));

		this.initialized = false;
		this.running = true;
	}

	run() {
		if (!this.initialized) {
			this.initialize();
			this.initialized = true;
		}

		this.update();
		this.draw();

		if (this.running) {
			window.requestAnimationFrame(this.run.bind(this));
		}
	}

	initialize() {}

	update() {}

	draw() {}
}
