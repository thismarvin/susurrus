export default class KeyboardState {
	#keysPressed: Set<string>;

	constructor(keysPressed: Set<string>) {
		this.#keysPressed = new Set<string>(keysPressed);
	}

	public isKeyDown(key: string) {
		return this.#keysPressed.has(key);
	}

	public isKeyUp(key: string) {
		return !this.isKeyDown(key);
	}
}
