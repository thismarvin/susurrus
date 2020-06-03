import * as Pointer from "./pointerManager.js";
// eslint-disable-next-line no-unused-vars
import PointerState from "./pointerState.js";

export default class SmartPointer {
	public get x() {
		return this.#x;
	}
	public get y() {
		return this.#y;
	}

	#element: HTMLElement;
	#previousPointerState: PointerState | null;
	#currentPointerState: PointerState | null;
	#x: number;
	#y: number;

	constructor(element: HTMLElement) {
		this.#element = element;
		this.#previousPointerState = null;
		this.#currentPointerState = null;
		this.#x = 0;
		this.#y = 0;
	}

	public pressed(button: string) {
		if (
			this.#previousPointerState === null ||
			this.#currentPointerState === null
		) {
			return false;
		}

		return (
			!Pointer.isButtonDown(button, this.#previousPointerState) &&
			Pointer.isButtonDown(button, this.#currentPointerState)
		);
	}

	public pressing(button: string) {
		if (this.#currentPointerState === null) {
			return false;
		}

		return Pointer.isButtonDown(button, this.#currentPointerState);
	}

	public update() {
		this.#previousPointerState = this.#currentPointerState;
		this.#currentPointerState = Pointer.getState();

		if (this.#currentPointerState !== null) {
			this.#x =
				this.#currentPointerState.event.clientX - this.#element.offsetLeft;
			this.#y =
				this.#currentPointerState.event.clientY - this.#element.offsetTop;
		}
	}
}
