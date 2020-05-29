import InputMapping from "./inputMapping.js";
import ResourceHandler from "../utilities/resourceHandler.js";

export default class InputProfile {
	public name: string;

	#inputMappings: ResourceHandler<InputMapping>;

	constructor(name: string) {
		this.name = name;
		this.#inputMappings = new ResourceHandler<InputMapping>();
	}

	public createMapping(name: string, keys: string) {
		const inputMapping = new InputMapping(name, keys);
		this.#inputMappings.register(inputMapping.name, inputMapping);
	}

	public getMapping(name: string) {
		return this.#inputMappings.get(name);
	}

	public remap(name: string, keys: string) {
		this.getMapping(name)?.remap(keys);
	}

	public removeMapping(name: string) {
		this.#inputMappings.remove(name);
	}
}
