// eslint-disable-next-line no-unused-vars
import Theater from "../theater.js";
import KeyboardState from "./keyboardState.js";

export default class Keyboard {
	#theater: Theater;
	#keys: Set<string>;

	constructor(theater: Theater) {
		this.#theater = theater;
		this.#keys = new Set<string>();

		window.addEventListener("keydown", (event) => {
			if (!this.#theater.inFocus) {
				return;
			}

			if (event.repeat) {
				return;
			}

			this.#keys.add(event.key.toLocaleLowerCase());
		});

		window.addEventListener("keyup", (event) => {
			this.#keys.delete(event.key.toLocaleLowerCase());
		});

		window.addEventListener("blur", () => {
			this.#keys.clear();
		});
	}

	public getState() {
		return new KeyboardState(this.#keys);
	}
}
