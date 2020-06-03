import KeyboardState from "./keyboardState.js";

const _keysPressed = new Set<string>();
let _lastEvent: KeyboardEvent | null = null;

window.addEventListener("keydown", (event) => {
	_lastEvent = event;

	if (event.repeat) {
		return;
	}

	_keysPressed.add(event.key.toLocaleLowerCase());
});

window.addEventListener("keyup", (event) => {
	_lastEvent = event;
	_keysPressed.delete(event.key.toLocaleLowerCase());
});

window.addEventListener("blur", () => {
	_lastEvent = null;
	_keysPressed.clear();
});

/**
 * Returns the current state of the keyboard.
 */
export function getState() {
	if (_lastEvent === null) {
		return null;
	}

	return new KeyboardState(_lastEvent, _keysPressed);
}

/**
 * Returns whether or not a given key is pressed on the keyboard.
 * @param key A single key, or multiple comma separated keys (e.g. s, m, shift, etc.).
 * @param keyboardState The current KeyboardState to test against.
 */
export function isKeyDown(key: string, keyboardState: KeyboardState) {
	// Format and separate "key" parameter into individual strings;
	const seperatedKeys = key.toLocaleLowerCase().split(",");

	for (let i = 0; i < seperatedKeys.length; i++) {
		if (keyboardState.keysPressed.has(seperatedKeys[i].trim())) {
			return true;
		}
	}

	return false;
}
