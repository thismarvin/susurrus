import InputMapping from "./inputMapping.js";

function _formatName(name: string) {
	return name.toLocaleLowerCase();
}

export default class InputProfile {
	public name: string;

	#inputMappings: Map<string, InputMapping>;

	constructor(name: string) {
		this.name = name;
		this.#inputMappings = new Map<string, InputMapping>();
	}

	public createMapping(
		name: string,
		keys: string,
		gamepadButtons?: string,
		mouseButtons?: string
	) {
		const formattedName = _formatName(name);

		if (this.#inputMappings.has(formattedName)) {
			throw new TypeError(
				"An InputMapping with that name already exists; try a different name."
			);
		}

		const inputMapping = new InputMapping(
			formattedName,
			keys,
			gamepadButtons,
			mouseButtons
		);
		this.#inputMappings.set(inputMapping.name, inputMapping);
	}

	public getMapping(name: string) {
		const formattedName = _formatName(name);

		if (!this.#inputMappings.has(formattedName)) {
			throw new TypeError(
				"An InputMapping with that name has not been registered."
			);
		}

		return this.#inputMappings.get(formattedName);
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
		const formattedName = _formatName(name);

		if (!this.#inputMappings.has(formattedName)) {
			throw new TypeError(
				"An InputMapping with that name has not been registered."
			);
		}

		this.#inputMappings.delete(formattedName);
	}
}
