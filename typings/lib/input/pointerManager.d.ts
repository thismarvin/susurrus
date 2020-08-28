import PointerState from "./pointerState.js";
/**
 * Returns the current state of the current pointer.
 */
export declare function getState(): PointerState | null;
/**
 * Returns whether or not a given button is pressed on the mouse.
 * @param button A single mouse button, or multiple comma separated mouse buttons (e.g. leftclick, rightclick, etc.).
 * @param pointerState The current PointerState to test against.
 */
export declare function isButtonDown(
	button: string,
	pointerState: PointerState
): boolean;
//# sourceMappingURL=pointerManager.d.ts.map
