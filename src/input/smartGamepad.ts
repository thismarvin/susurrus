import * as GamepadManager from "./gamepadManager.js";

export default class SmartGamepad {
	public get connected() {
		return this.#gamepad !== null;
	}

	public get description() {
		if (this.#gamepad === null) {
			return "";
		}

		return this.#gamepad.id;
	}

	public get buttons() {
		if (this.#gamepad === null) {
			return [] as GamepadButton[];
		}

		return this.#gamepad.buttons;
	}

	#playerIndex: number;
	#gamepad: Gamepad | null;

	constructor(playerIndex: number) {
		this.#playerIndex = playerIndex;
		this.#gamepad = null;
	}

	// TODO: this should probably be a string like the others :3
	public pressing(button: number) {
		if (this.#gamepad === null) {
			return false;
		}

		return this.#gamepad.buttons[button].pressed;
	}

	public update() {
		// @ts-ignore
		this.#gamepad = GamepadManager.getGamepad(this.#playerIndex);
	}
}
