import * as GamepadManager from "./gamepadManager.js";
// eslint-disable-next-line no-unused-vars
import GamepadState from "./gamepadState.js";

export default class SmartGamepad {
	public get connected() {
		return this.#currentGamepadState !== null;
	}

	public get description() {
		if (this.#currentGamepadState === null) {
			return "";
		}

		return this.#currentGamepadState.gamepad.id;
	}

	public get leftStickAxes() {
		if (this.#currentGamepadState === null) {
			return {
				x: 0,
				y: 0,
			};
		}

		return {
			x: this.#currentGamepadState.gamepad.axes[0],
			y: -this.#currentGamepadState.gamepad.axes[1],
		};
	}

	public get rightStickAxes() {
		if (this.#currentGamepadState === null) {
			return {
				x: 0,
				y: 0,
			};
		}

		return {
			x: this.#currentGamepadState.gamepad.axes[2],
			y: -this.#currentGamepadState.gamepad.axes[3],
		};
	}

	public get buttons() {
		if (this.#currentGamepadState === null) {
			return [] as GamepadButton[];
		}

		return this.#currentGamepadState.gamepad.axes;
	}

	#playerIndex: number;
	#previousGamepadState: GamepadState | null;
	#currentGamepadState: GamepadState | null;

	constructor(playerIndex: number) {
		this.#playerIndex = playerIndex;
		this.#previousGamepadState = null;
		this.#currentGamepadState = null;
	}

	public pressed(button: string) {
		if (
			this.#previousGamepadState === null ||
			this.#currentGamepadState === null
		) {
			return false;
		}

		return (
			!GamepadManager.isButtonDown(button, this.#previousGamepadState) &&
			GamepadManager.isButtonDown(button, this.#currentGamepadState)
		);
	}

	public pressing(button: string) {
		if (this.#currentGamepadState === null) {
			return false;
		}

		return GamepadManager.isButtonDown(button, this.#currentGamepadState);
	}

	public update() {
		this.#previousGamepadState = this.#currentGamepadState;
		this.#currentGamepadState = GamepadManager.getState(this.#playerIndex);
	}
}
