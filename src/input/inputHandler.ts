// eslint-disable-next-line no-unused-vars
import Theater from "../theater.js";
// eslint-disable-next-line no-unused-vars
import SmartKeyboard from "./smartKeyboard.js";
// eslint-disable-next-line no-unused-vars
import InputProfile from "./inputProfile.js";
import SmartGamepad from "./smartGamepad.js";

export default class InputHandler {
	#playerIndex: number;
	#smartKeyboard: SmartKeyboard;
	#gamepad: SmartGamepad;
	#inputProfile: InputProfile | null;

	constructor(theater: Theater, playerIndex: number) {
		this.#playerIndex = playerIndex;
		this.#smartKeyboard = theater.smartKeyboard;
		this.#inputProfile = null;
		this.#gamepad = new SmartGamepad(playerIndex);
	}

	public loadProfile(profile: InputProfile) {
		this.#inputProfile = profile;
	}

	public pressed(name: string) {
		if (this.#inputProfile === null) {
			throw new TypeError("An input profile has not been loaded yet.");
		}

		const inputMapping = this.#inputProfile.getMapping(name);

		//@ts-ignore
		if (this.#smartKeyboard.pressed(inputMapping.keys)) {
			return true;
		}

		return false;
	}

	public pressing(name: string) {
		if (this.#inputProfile === null) {
			throw new TypeError("An input profile has not been loaded yet.");
		}

		const inputMapping = this.#inputProfile.getMapping(name);

		//@ts-ignore
		if (this.#smartKeyboard.pressing(inputMapping.keys)) {
			return true;
		}

		return false;
	}

	public update() {
		this.#gamepad.update();
	}
}
