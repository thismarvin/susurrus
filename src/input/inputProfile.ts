import InputMapping from "./inputMapping.js";
import ResourceHandler from "../utilities/resourceHandler.js";

export default class InputProfile {
	public name: string;

	#inputMappings: ResourceHandler<InputMapping>;

	constructor(name: string) {
		this.name = name;
		this.#inputMappings = new ResourceHandler<InputMapping>();
	}

	public createMapping(
		name: string,
		keys: string,
		gamepadButtons?: string,
		mouseButtons?: string
	) {
		const inputMapping = new InputMapping(
			name,
			keys,
			gamepadButtons,
			mouseButtons
		);
		this.#inputMappings.register(inputMapping.name, inputMapping);
	}

	public getMapping(name: string) {
		return this.#inputMappings.get(name);
	}

	public remapKeys(name: string, keys: string) {
		this.getMapping(name)?.remapKeys(keys);
	}

	public remapGamepadButtons(name: string, buttons: string) {
		this.getMapping(name)?.remapGamepadButtons(buttons);
	}

	public remapMouseButtons(name: string, buttons: string) {
		this.getMapping(name)?.remapMouseButtons(buttons);
	}

	public removeMapping(name: string) {
		this.#inputMappings.remove(name);
	}
}
