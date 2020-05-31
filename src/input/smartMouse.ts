// eslint-disable-next-line no-unused-vars
import Mouse from "./mouse";
// eslint-disable-next-line no-unused-vars
import MouseState from "./mouseState";

export default class SmartMouse {
	#mouse: Mouse;
	#previousMouseState: MouseState | null;
	#currentMouseState: MouseState | null;

	constructor(mouse: Mouse) {
		this.#mouse = mouse;
		this.#previousMouseState = null;
		this.#currentMouseState = null;
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
		this.#currentMouseState = this.#mouse.getState();
	}
}
