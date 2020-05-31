// eslint-disable-next-line no-unused-vars
import Theater from "../theater.js";
// eslint-disable-next-line no-unused-vars
import SmartKeyboard from "./smartKeyboard.js";
// eslint-disable-next-line no-unused-vars
import InputProfile from "./inputProfile.js";

export default class InputHandler {
	#smartKeyboard: SmartKeyboard;
	#inputProfile: InputProfile | null;

	constructor(theater: Theater) {
		this.#smartKeyboard = theater.smartKeyboard;
		this.#inputProfile = null;
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
		// TODO: Update might be needed for Gamepad support?
	}
}
