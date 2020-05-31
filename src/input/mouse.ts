// eslint-disable-next-line no-unused-vars
import Theater from "../theater.js";
import MouseState from "./mouseState.js";

export default class Mouse {
	public get xCanvas() {
		return this.#xCanvas;
	}
	public get yCanvas() {
		return this.#yCanvas;
	}

	public get xScene() {
		return this.#xScene;
	}
	public get yScene() {
		return this.#yScene;
	}

	#theater: Theater;
	#xCanvas: number;
	#yCanvas: number;
	#xScene: number;
	#yScene: number;
	#buttonsPressed: number;

	constructor(theater: Theater) {
		this.#theater = theater;
		this.#xCanvas = 0;
		this.#yCanvas = 0;
		this.#xScene = 0;
		this.#yScene = 0;
		this.#buttonsPressed = 0;

		window.addEventListener("mousemove", (event) => {
			this.#xCanvas = event.clientX - this.#theater.canvas.offsetLeft;
			this.#yCanvas = event.clientY - this.#theater.canvas.offsetTop;

			this.#xScene =
				this.#xCanvas / this.#theater.graphics.scale -
				this.#theater.graphics.drawWidth / 2;
			this.#yScene =
				this.#yCanvas / this.#theater.graphics.scale -
				this.#theater.graphics.drawHeight / 2;
		});

		window.addEventListener("mousedown", (event) => {
			if (!this.#theater.inFocus) {
				return;
			}

			this.#buttonsPressed = event.buttons;
		});
		window.addEventListener("mouseup", (event) => {
			if (!this.#theater.inFocus) {
				return;
			}

			this.#buttonsPressed = event.buttons;
		});
		window.addEventListener("blur", () => {
			this.#buttonsPressed = 0;
		});
	}

	public getState() {
		return new MouseState(this.#buttonsPressed);
	}
}
