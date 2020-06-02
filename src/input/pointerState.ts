/**
 * Returns whether or not a target button is pressed on the mouse.
 * @param targetButton A single mouse button, or multiple comma seperated mouse buttons (e.g. leftclick, rightclick, etc.).
 * @param event The current PointerEvent.
 */
function _isMouseButtonPressed(targetButton: string, event: PointerEvent) {
	// Format and seperate targetButton into individual strings;
	const formattedButtons = targetButton
		.toLocaleLowerCase()
		.split(",")
		.map((value) => value.trim());

	// Compute the cumulative value of all formatedButtons.
	const computedButton = formattedButtons.reduce((accumulator, current) => {
		if (current === "leftclick") return accumulator + 1;
		if (current === "rightclick") return accumulator + 2;
		if (current === "middleclick") return accumulator + 4;
		return accumulator;
	}, 0);

	return (event.buttons & computedButton) !== 0;
}

export default class MouseState {
	#event: PointerEvent | null;

	constructor(event: PointerEvent | null) {
		this.#event = event;
	}

	/**
	 * Returns whether or not a target button is pressed on the mouse.
	 * @param button A single mouse button, or multiple comma seperated mouse buttons (e.g. leftclick, rightclick, etc.).
	 */
	public isButtonDown(button: string) {
		if (this.#event === null) {
			return false;
		}

		return _isMouseButtonPressed(button, this.#event);
	}

	/**
	 * Returns whether or not a target button is not pressed on the mouse.
	 * @param button A single mouse button, or multiple comma seperated mouse buttons (e.g. leftclick, rightclick, etc.).
	 */
	public isButtonUp(button: string) {
		if (this.#event === null) {
			return false;
		}

		return !_isMouseButtonPressed(button, this.#event);
	}
}
