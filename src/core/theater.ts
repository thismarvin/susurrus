import * as Graphics from "../lib/graphics.js";
import * as Input from "../lib/input.js";
import SceneManager from "./sceneManager.js";
import GeometryManager from "./graphics/geometry/geometryManager.js";
import Factory from "./factory.js";

export default class Theater {
	public readonly smartKeyboard: Input.SmartKeyboard;
	public readonly smartPointer: Input.SmartPointer;

	public readonly sceneManager: SceneManager;
	public readonly factory: Factory;

	public loop: boolean;

	public get parent() {
		return this.#parent;
	}

	public get canvas() {
		return this.#canvas;
	}

	public get graphics() {
		return this.#graphics;
	}

	public get geometryManager() {
		return this.#geometryManager;
	}

	public get inFocus() {
		return this.#inFocus;
	}

	public get totalElapsedTime() {
		return this.#totalElapsedTime;
	}

	#parent: HTMLElement | null;
	#canvas: HTMLCanvasElement | null;
	#graphics: Graphics.GraphicsManager | null;

	#geometryManager: GeometryManager | null;

	#initialized: boolean;
	#inFocus: boolean;
	#totalElapsedTime: number;

	constructor() {
		this.#parent = null;
		this.#canvas = null;
		this.#graphics = null;

		this.#geometryManager = null;

		this.smartKeyboard = new Input.SmartKeyboard();
		this.smartPointer = new Input.SmartPointer();

		this.sceneManager = new SceneManager();
		this.factory = new Factory(this);

		this.loop = true;
		this.#initialized = false;
		this.#inFocus = false;
		this.#totalElapsedTime = 0;

		window.addEventListener("mousedown", (event) => {
			if (this.#canvas === null) {
				return;
			}

			this.#inFocus = event.target === this.#canvas;
		});

		Object.defineProperty(this, "smartKeyboard", {
			writable: false,
		});
		Object.defineProperty(this, "smartPointer", {
			writable: false,
		});
		Object.defineProperty(this, "sceneManager", {
			writable: false,
		});
		Object.defineProperty(this, "factory", {
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
	 * Finds an HTMLElement with a given id, and sets the element as the parent of the theater.
	 * Any HTMLElements created using this theater will be appended to said parent.
	 * @param id The id of an existing HTMLElement on the current page.
	 */
	public setParent(id: string) {
		const element = document.getElementById(id);

		if (element === null) {
			throw new TypeError(`Could not find an element with an id of '${id}'.`);
		}

		this.#parent = element;

		return this;
	}

	/**
	 * Creates and appends a new HTMLCanvas to the theater's parent HTMLElement.
	 * Moreover, a valid GraphicsManager is created and initialized.
	 * @param id The id the new HTMLCanvas should have.
	 * @param width The width of the new HTMLCanvas.
	 * @param height The height of the new HTMLCanvas.
	 */
	public createCanvas(id: string, width: number, height: number) {
		if (this.#parent === null) {
			throw new Error(
				"A parent element does not exist; a canvas cannot be created. Make sure to call that 'setParent(id)' was called."
			);
		}

		this.#canvas = document.createElement("canvas");
		this.#canvas.id = id;
		this.#canvas.width = width;
		this.#canvas.height = height;
		this.#parent.appendChild(this.#canvas);

		this.#graphics = new Graphics.GraphicsManager(
			Graphics.WebGL.getWebGLContext(this.#canvas)
		);

		this.#geometryManager = new GeometryManager(this.#graphics);
		this.factory.attachGraphics(this.#graphics);

		this.smartPointer.attachElement(this.#canvas);
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
	 * A method called once every frame, after update, that is typically used to present visuals.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	public draw(deltaTime: number) {
		if (this.#graphics === null) {
			throw new TypeError(
				"The GraphicsManager has not been instantiated; cannot draw anything. Make sure to call appendCanvas() before rendering anything."
			);
		}

		this.sceneManager.draw(this.#graphics, deltaTime);
	}

	/**
	 * Code that is integral to the engine that is guaranteed to be updated every frame.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	// eslint-disable-next-line no-unused-vars
	private managedUpdate(deltaTime: number) {
		this.smartKeyboard.update();
		this.smartPointer.update();
	}

	private main(timeStamp: number) {
		let deltaTime = (timeStamp - this.#totalElapsedTime) / 1000;
		if (Number.isNaN(deltaTime)) {
			deltaTime = 0;
		}
		this.#totalElapsedTime = timeStamp;

		this.managedUpdate(deltaTime);
		this.update(deltaTime);
		if (this.graphics !== null) {
			this.draw(deltaTime);
		}

		if (this.loop) {
			window.requestAnimationFrame((timeStamp) => {
				this.main(timeStamp);
			});
		}
	}
}
