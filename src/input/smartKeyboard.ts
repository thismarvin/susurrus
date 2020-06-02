import * as KeyboadManager from "./keyboardManager.js";
// eslint-disable-next-line no-unused-vars
import KeyboardState from "./keyboardState.js";

export default class SmartKeyboard {
	#previousKeyState: KeyboardState | null;
	#currentKeyState: KeyboardState | null;

	constructor() {
		this.#previousKeyState = null;
		this.#currentKeyState = null;
	}

	public pressed(key: string) {
		if (this.#previousKeyState === null || this.#currentKeyState === null) {
			return false;
		}

		return (
			!KeyboadManager.isKeyDown(key, this.#previousKeyState) &&
			KeyboadManager.isKeyDown(key, this.#currentKeyState)
		);
	}

	public pressing(key: string) {
		if (this.#currentKeyState === null) {
			return false;
		}

		return KeyboadManager.isKeyDown(key, this.#currentKeyState);
	}

	public update() {
		this.#previousKeyState = this.#currentKeyState;
		this.#currentKeyState = KeyboadManager.getState();
	}
}
