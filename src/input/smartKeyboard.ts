// eslint-disable-next-line no-unused-vars
import Keyboard from "./keyboard.js";
// eslint-disable-next-line no-unused-vars
import KeyboardState from "./keyboardState.js";

export default class SmartKeyboard {
	#keyboard: Keyboard;
	#previousKeyState: KeyboardState | null;
	#currentKeyState: KeyboardState | null;

	constructor(keyboard: Keyboard) {
		this.#keyboard = keyboard;
		this.#previousKeyState = null;
		this.#currentKeyState = null;
	}

	public pressed(key: string) {
		if (
			!this.#previousKeyState?.isKeyDown(key) &&
			this.#currentKeyState?.isKeyDown(key)
		) {
			return true;
		}

		return false;
	}

	public pressing(key: string) {
		return this.#currentKeyState?.isKeyDown(key);
	}

	public update() {
		this.#previousKeyState = this.#currentKeyState;
		this.#currentKeyState = this.#keyboard.getState();
	}
}
