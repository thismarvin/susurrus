import * as WebGL from "./graphics/webGL.js";
import Graphics from "./graphics/graphicsManager.js";
import Keyboard from "./input/keyboard.js";
import SmartKeyboard from "./input/smartKeyboard.js";
import Mouse from "./input/mouse.js";
import Props from "./props.js";
import SceneManager from "./sceneManager.js";
import GeometryManager from "./graphics/geometry/geometryManager.js";

export default class Theater {
	public readonly parent: HTMLElement;
	public readonly canvas: HTMLCanvasElement;
	public readonly graphics: Graphics;

	public readonly keyboard: Keyboard;
	public readonly smartKeyboard: SmartKeyboard;
	public readonly mouse: Mouse;

	public readonly props: Props;
	public readonly sceneManager: SceneManager;
	public readonly geometryManager: GeometryManager;

	public loop: boolean;

	public get inFocus() {
		return this.#focus;
	}

	public get totalElapsedTime() {
		return this.#totalElapsedTime;
	}

	#initialized: boolean;
	#focus: boolean;
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

		this.keyboard = new Keyboard(this);
		this.smartKeyboard = new SmartKeyboard(this.keyboard);
		this.mouse = new Mouse(this);

		this.sceneManager = new SceneManager();
		this.geometryManager = new GeometryManager(this.graphics); // * not 100% sure about this!

		this.props = new Props(this.graphics);

		this.loop = true;
		this.#initialized = false;
		this.#focus = false;
		this.#totalElapsedTime = 0;

		window.addEventListener("mousedown", (event) => {
			this.#focus = event.target === this.canvas;
		});

		Object.defineProperty(this, "parent", {
			writable: false,
		});
		Object.defineProperty(this, "canvas", {
			writable: false,
		});
		Object.defineProperty(this, "graphics", {
			writable: false,
		});
		Object.defineProperty(this, "keyboard", {
			writable: false,
		});
		Object.defineProperty(this, "smartKeyboard", {
			writable: false,
		});
		Object.defineProperty(this, "mouse", {
			writable: false,
		});
		Object.defineProperty(this, "props", {
			writable: false,
		});
		Object.defineProperty(this, "sceneManager", {
			writable: false,
		});
		Object.defineProperty(this, "geometryManager", {
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
