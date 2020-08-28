import GamepadState from "./gamepadState.js";
/**
 * Returns the current state of a specific gamepad.
 * @param playerIndex The index of the target gamepad.
 */
export declare function getState(playerIndex: number): GamepadState | null;
/**
 * Returns whether or not a given button is pressed on a gamepad.
 * @param button A single gamepad button, or multiple comma separated gamepad buttons (e.g. A, DPadUp, LeftTrigger, etc.).
 * @param gamepadState The current GamepadState to test against.
 */
export declare function isButtonDown(
	button: string,
	gamepadState: GamepadState
): boolean;
//# sourceMappingURL=gamepadManager.d.ts.map
