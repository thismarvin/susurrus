export default class GamepadState {
	public get gamepad() {
		return this.#gamepad;
	}

	#gamepad: Gamepad;

	constructor(gamepad: Gamepad) {
		this.#gamepad = gamepad;
	}
}
