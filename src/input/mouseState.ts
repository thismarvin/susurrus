export default class MouseState {
	#buttonsPressed: number;

	constructor(buttonsPressed: number) {
		this.#buttonsPressed = buttonsPressed;
	}

	public isButtonDown(button: string) {
		const seperatedButtons = button.toLocaleLowerCase().split(",");

		let mask = 0;
		for (let i = 0; i < seperatedButtons.length; i++) {
			switch (seperatedButtons[i].trim()) {
				case "leftclick":
					mask += 1;
					break;
				case "rightclick":
					mask += 2;
					break;
				case "middleclick":
					mask += 4;
					break;
			}
		}

		return (this.#buttonsPressed & mask) !== 0;
	}

	public isButtonUp(button: string) {
		return !this.isButtonDown(button);
	}
}
