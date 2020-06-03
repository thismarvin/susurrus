import GamepadState from "./gamepadState.js";

const _gamepads = new Map<number, Gamepad>();
const _xinputButtonMap = new Map<string, number>();

_xinputButtonMap.set("a", 0);
_xinputButtonMap.set("b", 1);
_xinputButtonMap.set("x", 2);
_xinputButtonMap.set("y", 3);
_xinputButtonMap.set("leftbumper", 4);
_xinputButtonMap.set("rightbumper", 5);
_xinputButtonMap.set("lefttrigger", 6);
_xinputButtonMap.set("righttrigger", 7);
_xinputButtonMap.set("back", 8);
_xinputButtonMap.set("start", 9);
_xinputButtonMap.set("leftstick", 10);
_xinputButtonMap.set("rightstick", 11);
_xinputButtonMap.set("dpadup", 12);
_xinputButtonMap.set("dpaddown", 13);
_xinputButtonMap.set("dpadleft", 14);
_xinputButtonMap.set("dpadright", 15);

//@ts-ignore
window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
	_gamepads.set(event.gamepad.index, event.gamepad);
});
//@ts-ignore
window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
	_gamepads.delete(event.gamepad.index);
});

/**
 * Returns the current state of a specific gamepad.
 * @param playerIndex The index of the target gamepad.
 */
export function getState(playerIndex: number) {
	if (!_gamepads.has(playerIndex)) {
		return null;
	}

	//@ts-ignore
	return new GamepadState(_gamepads.get(playerIndex));
}

/**
 * Returns whether or not a given button is pressed on a gamepad.
 * @param button A single gamepad button, or multiple comma separated gamepad buttons (e.g. A, DPadUp, LeftTrigger, etc.).
 * @param gamepadState The current GamepadState to test against.
 */
export function isButtonDown(button: string, gamepadState: GamepadState) {
	// Format and separate "button" parameter into individual strings;
	const seperatedButtons = button.toLocaleLowerCase().split(",");

	for (let i = 0; i < seperatedButtons.length; i++) {
		const formattedButton = seperatedButtons[i].trim();
		// Check if a formatted button is included in the xinput mappings.
		if (_xinputButtonMap.has(formattedButton)) {
			// Get the appropriate index of the button.
			const buttonValue = _xinputButtonMap.get(formattedButton);
			if (
				//@ts-ignore
				gamepadState.gamepad.buttons[buttonValue].pressed &&
				//@ts-ignore
				gamepadState.gamepad.buttons[buttonValue].value > 0
			) {
				return true;
			}
		}
	}

	return false;
}
