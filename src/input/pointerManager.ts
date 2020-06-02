import PointerState from "./pointerState.js";

let _lastEvent: PointerEvent | null = null;

window.addEventListener("pointermove", (event) => {
	_lastEvent = event;
});
window.addEventListener("pointerdown", (event) => {
	_lastEvent = event;
});
window.addEventListener("pointerup", (event) => {
	_lastEvent = event;
});
window.addEventListener("blur", () => {
	_lastEvent = null;
});

/**
 * Returns the current state of the current pointer.
 */
export function getState() {
	if (_lastEvent === null) {
		return null;
	}

	return new PointerState(_lastEvent);
}

/**
 * Returns whether or not a given button is pressed on the mouse.
 * @param button A single mouse button, or multiple comma separated mouse buttons (e.g. leftclick, rightclick, etc.).
 * @param pointerState The current PointerState to test against.
 */
export function isButtonDown(button: string, pointerState: PointerState) {
	// Format and separate "button" parameter into individual strings;
	const formattedButtons = button.toLocaleLowerCase().split(",");
	// Duplicate button strings would break this method, so get rid of them!
	const formattedButtonsSet = new Set<string>(formattedButtons);

	// Compute the cumulative value of all entries in formatedButtonsSet.
	let computedButtons = 0;
	for (let entry of formattedButtonsSet) {
		switch (entry.trim()) {
			case "leftclick":
				computedButtons += 1;
				break;
			case "rightclick":
				computedButtons += 2;
				break;
			case "middleclick":
				computedButtons += 4;
				break;
		}
	}

	return (pointerState.event.buttons & computedButtons) !== 0;
}
