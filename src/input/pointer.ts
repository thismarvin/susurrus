import PointerState from "./pointerState.js";

export default class Pointer {
	public get lastEvent() {
		return this.#lastEvent;
	}

	public get type() {
		return this.#lastEvent?.pointerType;
	}

	#lastEvent: PointerEvent | null;

	constructor() {
		this.#lastEvent = null;

		window.addEventListener("pointermove", (event) => {
			this.#lastEvent = event;
		});
		window.addEventListener("pointerdown", (event) => {
			this.#lastEvent = event;
		});
		window.addEventListener("pointerup", (event) => {
			this.#lastEvent = event;
		});
		window.addEventListener("blur", () => {
			this.#lastEvent = null;
		});
	}

	public getState() {
		return new PointerState(this.#lastEvent);
	}
}
