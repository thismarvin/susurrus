import KeyboardState from "./keyboardState.js";
/**
 * Returns the current state of the keyboard.
 */
export declare function getState(): KeyboardState | null;
/**
 * Returns whether or not a given key is pressed on the keyboard.
 * @param key A single key, or multiple comma separated keys (e.g. s, m, shift, etc.).
 * @param keyboardState The current KeyboardState to test against.
 */
export declare function isKeyDown(
	key: string,
	keyboardState: KeyboardState
): boolean;
//# sourceMappingURL=keyboardManager.d.ts.map
