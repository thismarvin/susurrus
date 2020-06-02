export default class KeyboardState {
	public get event() {
		return this.#event;
	}

	public get keysPressed() {
		return this.#keysPressed;
	}

	#event: KeyboardEvent;
	#keysPressed: Set<string>;

	constructor(event: KeyboardEvent, keysPressed: Set<string>) {
		this.#event = event;
		this.#keysPressed = new Set<string>(keysPressed);
	}
}
