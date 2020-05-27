export default class KeyboardState {
	#keyboardEvent: Set<string>;

	constructor(keyboardEvent: Set<string>) {
		this.#keyboardEvent = keyboardEvent;
	}

	public isKeyDown(key: string) {
		return this.#keyboardEvent.has(key);
	}

	public isKeyUp(key: string) {
		return !this.isKeyDown(key);
	}
}
