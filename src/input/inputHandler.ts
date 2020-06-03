import SmartKeyboard from "./smartKeyboard.js";
import SmartGamepad from "./smartGamepad.js";
import SmartPointer from "./smartPointer.js";
// eslint-disable-next-line no-unused-vars
import InputProfile from "./inputProfile.js";

export default class InputHandler {
	public readonly playerIndex: number;

	#smartKeyboard: SmartKeyboard;
	#smartPointer: SmartPointer;
	#smartGamepad: SmartGamepad;
	#inputProfile: InputProfile | null;

	constructor(element: HTMLElement, playerIndex: number) {
		this.playerIndex = playerIndex;
		this.#smartKeyboard = new SmartKeyboard();
		this.#smartPointer = new SmartPointer(element);
		this.#smartGamepad = new SmartGamepad(playerIndex);
		this.#inputProfile = null;

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
				return true;
			}
		}

		if (this.#smartGamepad.connected) {
			if (this.#smartGamepad.pressed(inputMapping.gamepadButtons)) {
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
				return true;
			}
		}

		if (this.#smartGamepad.connected) {
			if (this.#smartGamepad.pressing(inputMapping.gamepadButtons)) {
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
