export default class KeyboardState {
	#keysPressed: Set<string>;

	constructor(keysPressed: Set<string>) {
		this.#keysPressed = new Set<string>(keysPressed);
	}

	public isKeyDown(key: string) {
		const seperatedKeys = key.toLocaleLowerCase().split(",");
		for (let i = 0; i < seperatedKeys.length; i++) {
			if (this.#keysPressed.has(seperatedKeys[i].trim())) {
				return true;
			}
		}

		return false;
	}

	public isKeyUp(key: string) {
		return !this.isKeyDown(key);
	}
}
