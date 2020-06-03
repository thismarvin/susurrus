export default class GamepadState {
	public readonly gamepad: Gamepad;

	constructor(gamepad: Gamepad) {
		this.gamepad = gamepad;

		Object.defineProperty(this, "gamepad", {
			writable: false,
		});
	}
}
