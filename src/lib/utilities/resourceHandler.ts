function _formatName(name: string) {
	return name.toLocaleLowerCase();
}

export default class ResourceHandler<T> {
	public get length() {
		return this.#data.entries.length;
	}

	public get entries() {
		return this.#data.entries;
	}

	#data: Map<string, T>;

	constructor() {
		this.#data = new Map<string, T>();
	}

	public register(name: string, entry: T) {
		const formattedName = _formatName(name);

		if (this.#data.has(formattedName)) {
			throw new TypeError(
				"An entry with that name already exists; try a different name."
			);
		}

		this.#data.set(formattedName, entry);
	}

	public get(name: string) {
		const formattedName = _formatName(name);

		if (!this.#data.has(formattedName)) {
			throw new TypeError("An entry with that name has not been registered.");
		}

		return this.#data.get(formattedName);
	}

	public remove(name: string) {
		const formattedName = _formatName(name);

		if (!this.#data.has(formattedName)) {
			throw new TypeError("An entry with that name has not been registered.");
		}

		// * Eventually you would want to call dispose() here.

		this.#data.delete(formattedName);
	}
}
