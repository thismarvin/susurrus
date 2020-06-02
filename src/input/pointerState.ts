export default class PointerState {
	public get event() {
		return this.#event;
	}

	#event: PointerEvent;

	constructor(event: PointerEvent) {
		this.#event = event;
	}
}
