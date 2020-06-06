import SmartKeyboard from "./smartKeyboard.js";
import SmartGamepad from "./smartGamepad.js";
import SmartPointer from "./smartPointer.js";
// eslint-disable-next-line no-unused-vars
import InputProfile from "./inputProfile.js";

export default class InputHandler {
	public readonly playerIndex: number;

	public get lastInputType() {
		return this.#inputMode;
	}

	public get pointerPosition() {
		return {
			x: this.#smartPointer.x,
			y: this.#smartPointer.y,
		};
	}

	#smartKeyboard: SmartKeyboard;
	#smartPointer: SmartPointer;
	#smartGamepad: SmartGamepad;
	#inputProfile: InputProfile | null;
	#inputMode: string;

	constructor(element: HTMLElement, playerIndex: number) {
		this.playerIndex = playerIndex;
		this.#smartKeyboard = new SmartKeyboard();
		this.#smartPointer = new SmartPointer();
		this.#smartGamepad = new SmartGamepad(playerIndex);
		this.#inputProfile = null;
		this.#inputMode = "keyboard";

		this.#smartPointer.attachElement(element);

		Object.defineProperty(this, "playerIndex", {
			writable: false,
		});
	}

	public loadProfile(profile: InputProfile) {
		this.#inputProfile = profile;
	}

	public pressed(name: string) {
		if (this.#inputProfile === null) {
			throw new TypeError("An input profile has not been loaded yet.");
		}

		const inputMapping = this.#inputProfile.getMapping(name);

		if (inputMapping === undefined) {
			return false;
		}

		if (this.playerIndex === 0) {
			if (
				this.#smartKeyboard.pressed(inputMapping.keys) ||
				this.#smartPointer.pressed(inputMapping.mouseButtons)
			) {
				this.#inputMode = "keyboard";
				return true;
			}
		}

		if (this.#smartGamepad.connected) {
			if (this.#smartGamepad.pressed(inputMapping.gamepadButtons)) {
				this.#inputMode = "gamepad";
				return true;
			}
		}

		return false;
	}

	public pressing(name: string) {
		if (this.#inputProfile === null) {
			throw new TypeError("An input profile has not been loaded yet.");
		}

		const inputMapping = this.#inputProfile.getMapping(name);

		if (inputMapping === undefined) {
			return false;
		}

		if (this.playerIndex === 0) {
			if (
				this.#smartKeyboard.pressing(inputMapping.keys) ||
				this.#smartPointer.pressing(inputMapping.mouseButtons)
			) {
				this.#inputMode = "keyboard";
				return true;
			}
		}

		if (this.#smartGamepad.connected) {
			if (this.#smartGamepad.pressing(inputMapping.gamepadButtons)) {
				this.#inputMode = "gamepad";
				return true;
			}
		}

		return false;
	}

	public update() {
		this.#smartKeyboard.update();
		this.#smartPointer.update();
		this.#smartGamepad.update();
	}
}
