export default class InputMapping {
	public readonly name: string;

	public get keys() {
		return this.#keys;
	}

	public get gamepadButtons() {
		return this.#gamepadButtons;
	}

	public get mouseButtons() {
		return this.#mouseButtons;
	}

	#keys: string;
	#gamepadButtons: string;
	#mouseButtons: string;

	constructor(
		name: string,
		keys?: string,
		gamepadButtons?: string,
		mouseButtons?: string
	) {
		this.name = name;
		this.#keys = "";
		this.#gamepadButtons = "";
		this.#mouseButtons = "";

		if (keys !== undefined) {
			this.#keys = keys;
		}
		if (gamepadButtons !== undefined) {
			this.#gamepadButtons = gamepadButtons;
		}
		if (mouseButtons !== undefined) {
			this.#mouseButtons = mouseButtons;
		}

		Object.defineProperty(this, "name", {
			writable: false,
		});
	}

	public remapKeys(keys: string) {
		this.#keys = keys;
	}
	public remapGamepadButtons(buttons: string) {
		this.#gamepadButtons = buttons;
	}
	public remapMouseButtons(buttons: string) {
		this.#mouseButtons = buttons;
	}
}
