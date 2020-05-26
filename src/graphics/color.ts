const _rgbStep = 1 / 255;

export default class Color {
	//#region Getters and Setters
	get r() {
		return this.#r;
	}
	set r(value) {
		this.#r = this.validateValue(value);
	}

	get g() {
		return this.#g;
	}
	set g(value) {
		this.#g = this.validateValue(value);
	}

	get b() {
		return this.#b;
	}
	set b(value) {
		this.#b = this.validateValue(value);
	}

	get a() {
		return this.#a;
	}
	set a(value) {
		this.#a = this.validateValue(value);
	}
	//#endregion

	#r: number;
	#g: number;
	#b: number;
	#a: number;

	constructor(hex: string | number, a?: number) {
		this.#r = 0;
		this.#g = 0;
		this.#b = 0;
		this.#a = 1;

		switch (typeof hex) {
			case "number": {
				this.#r = this.validateValue(((hex & 0xff0000) >> 16) / 255);
				this.#g = this.validateValue(((hex & 0xff00) >> 8) / 255);
				this.#b = this.validateValue((hex & 0xff) / 255);
				break;
			}
			case "string": {
				const hexAsNumber = parseInt(hex, 16);
				this.#r = this.validateValue(((hexAsNumber & 0xff0000) >> 16) / 255);
				this.#g = this.validateValue(((hexAsNumber & 0xff00) >> 8) / 255);
				this.#b = this.validateValue((hexAsNumber & 0xff) / 255);
				break;
			}
		}

		if (a !== undefined) {
			this.multiply(this.validateValue(a));
		}
	}

	public fromRGB(r: number, g: number, b: number, a?: number) {
		this.#r = this.validateValue(r / 255);
		this.#g = this.validateValue(g / 255);
		this.#b = this.validateValue(b / 255);

		if (a !== undefined) {
			this.multiply(this.validateValue(a));
		}
		return this;
	}

	public multiply(value: number) {
		this.#r = this.validateValue(this.#r * value);
		this.#g = this.validateValue(this.#g * value);
		this.#b = this.validateValue(this.#b * value);
		this.#a = this.validateValue(this.#a * value);
	}

	public toArray() {
		return [this.#r, this.#g, this.#b, this.#a];
	}

	public toString() {
		const rAsRGB = Math.floor(this.#r * 255);
		const gAsRGB = Math.floor(this.#g * 255);
		const bAsRGB = Math.floor(this.#b * 255);

		let rString = rAsRGB.toString(16);
		if (rString.length === 1) {
			rString = `0${rString}`;
		}

		let gString = gAsRGB.toString(16);
		if (gString.length === 1) {
			gString = `0${gString}`;
		}

		let bString = bAsRGB.toString(16);
		if (bString.length === 1) {
			bString = `0${bString}`;
		}

		return `(${rAsRGB} ${gAsRGB} ${bAsRGB}) ${this.#a.toFixed(
			4
		)}, 0x${rString}${gString}${bString}`;
	}

	private validateValue(value: number) {
		if (value < _rgbStep) {
			return 0;
		}

		if (value > 1) {
			return 1;
		}

		return Math.floor(value / _rgbStep) * _rgbStep;
	}
}
