import Pointer from "./pointer.js";
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
	#pointer: Pointer;
	#previousMouseState: PointerState | null;
	#currentMouseState: PointerState | null;
	#x: number;
	#y: number;

	constructor(element: HTMLElement) {
		this.#element = element;
		this.#pointer = new Pointer();
		this.#previousMouseState = null;
		this.#currentMouseState = null;
		this.#x = 0;
		this.#y = 0;
	}

	public pressed(button: string) {
		if (
			!this.#previousMouseState?.isButtonDown(button) &&
			this.#currentMouseState?.isButtonDown(button)
		) {
			return true;
		}

		return false;
	}

	public pressing(button: string) {
		return this.#currentMouseState?.isButtonDown(button);
	}

	public update() {
		this.#previousMouseState = this.#currentMouseState;
		this.#currentMouseState = this.#pointer.getState();

		if (this.#pointer.lastEvent !== null) {
			this.#x = this.#pointer.lastEvent.clientX - this.#element.offsetLeft;
			this.#y = this.#pointer.lastEvent.clientY - this.#element.offsetTop;
		}
	}
}
