import * as WebGL from "./graphics/webGL.js";
import Graphics from "./graphics/graphicsManager.js";
import Keyboard from "./input/keyboard.js";
import SmartKeyboard from "./input/smartKeyboard.js";
import Mouse from "./input/mouse.js";
import SmartMouse from "./input/smartMouse.js";
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
	public readonly smartMouse: SmartMouse;

	public readonly props: Props;
	public readonly sceneManager: SceneManager;
	public readonly geometryManager: GeometryManager;

	public loop: boolean;

	public get inFocus() {
		return this.#inFocus;
	}

	public get totalElapsedTime() {
		return this.#totalElapsedTime;
	}

	#initialized: boolean;
	#inFocus: boolean;
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
		this.smartMouse = new SmartMouse(this.mouse);

		this.sceneManager = new SceneManager();
		this.geometryManager = new GeometryManager(this.graphics); // * not 100% sure about this!

		this.props = new Props(this.graphics);

		this.loop = true;
		this.#initialized = false;
		this.#inFocus = false;
		this.#totalElapsedTime = 0;

		window.addEventListener("mousedown", (event) => {
			this.#inFocus = event.target === this.canvas;
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
		Object.defineProperty(this, "smartMouse", {
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

	/**
	 * Jumpstarts the runtime of your project.
	 */
	public run() {
		if (!this.#initialized) {
			this.initialize();
			this.#initialized = true;
		}

		this.main(0);
	}

	/**
	 * A method that is called once at the start of runtime that is typically used to setup your project.
	 */
	public initialize() {}

	/**
	 * A method called once every frame, before draw, that is typically used to perform runtime calculations and logic.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	public update(deltaTime: number) {
		this.sceneManager.update(deltaTime);
	}

	/**
	 * A method called once every frame, after update, that is typically used to display visualizes.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	public draw(deltaTime: number) {
		this.sceneManager.draw(this.graphics, deltaTime);
	}

	/**
	 * Code that is integral to the engine that is guaranteed to be updated every frame.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	// eslint-disable-next-line no-unused-vars
	private managedUpdate(deltaTime: number) {
		this.smartMouse.update();
	}

	private main(timeStamp: number) {
		let deltaTime = (timeStamp - this.#totalElapsedTime) / 1000;
		if (Number.isNaN(deltaTime)) {
			deltaTime = 0;
		}
		this.#totalElapsedTime = timeStamp;

		this.managedUpdate(deltaTime);
		this.update(deltaTime);
		this.draw(deltaTime);

		if (this.loop) {
			window.requestAnimationFrame((timeStamp) => {
				this.main(timeStamp);
			});
		}
	}
}
