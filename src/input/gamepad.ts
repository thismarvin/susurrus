export default class Gamepad {
	public get connected() {
		return this.#connected;
	}

	public get playerIndex() {
		if (this.#gamepad === null) {
			return -1;
		}

		return this.#gamepad.index + 1;
	}

	public get description() {
		if (this.#gamepad === null) {
			return "";
		}

		return this.#gamepad.id;
	}

	#gamepad: globalThis.Gamepad | null;
	#connected: boolean;

	constructor() {
		this.#gamepad = null;
		this.#connected = false;

		//@ts-ignore
		window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
			this.#gamepad = event.gamepad;
			this.#connected = true;
		});
		window.addEventListener("gamepaddisconnected", () => {
			this.#gamepad = null;
			this.#connected = false;
		});
	}
}
