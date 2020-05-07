import * as PropertyAssent from "../utilities/propertyAssent.mjs";

class Color {
	//#region Class Properties
	// public:
	// =======================
	// r;
	// g;
	// b;
	// a;

	// private:
	// =======================
	// _r;
	// _g;
	// _b;
	// _a;
	//#endregion

	constructor(r, g, b, a) {
		this._r = r;
		this._g = g;
		this._b = b;
		this._a = a;

		Object.defineProperty(this, "r", {
			get() {
				return this._r * this._a;
			},
			set(value) {
				this._r = value;
			},
		});
		Object.defineProperty(this, "g", {
			get() {
				return this._g * this._a;
			},
			set(value) {
				this._g = value;
			},
		});
		Object.defineProperty(this, "b", {
			get() {
				return this._b * this._a;
			},
			set(value) {
				this._b = value;
			},
		});
		Object.defineProperty(this, "a", {
			get() {
				return this._a;
			},
			set(value) {
				this._a = value;
			},
		});

		return new Proxy(this, proxySetTrap);
	}

	toArray() {
		return [this.r, this.g, this.b, this.a];
	}

	toString() {
		return `( ${parseInt(this.r * 255)} ${parseInt(this.g * 255)} ${parseInt(
			this.b * 255
		)} ${parseInt(this.a * 255)} )`;
	}
}

class ColorFromHex {
	constructor(hex, a) {
		const r = ((hex & 0xff0000) >> 16) / 255;
		const g = ((hex & 0xff00) >> 8) / 255;
		const b = (hex & 0xff) / 255;
		return new Color(r, g, b, a);
	}
}

const lowpLowerBounds = 0.00390625;

/**
 * Maps a given value to be within the range [0, 1]. Note that if the value is greater than one
 * then the functions assumes we are working with integer RGB values that are in the range [0, 255].
 * @param {number} value The number to be mapped.
 */
function mapColorValue(value) {
	// Don't store a number with more precision than lowp even has.
	if (value <= lowpLowerBounds) {
		return 0;
	}

	// If the value is less than one, we can assume the color has already been mapped.
	if (value <= 1) {
		return value;
	}

	// The value has not been mapped, so let us map the color and check both bounds.
	let result = parseInt(value) / 255;
	result = Math.max(0, result);
	result = Math.min(1, result);

	return result;
}

/**
 * This trap is specifically for Color's constructor. Essentially this trap handles overloading,
 * but in a hacky JavaScript kinda way.
 */
const proxyConstructTrap = {
	construct(_, args) {
		// Make sure all arguments are numbers.
		for (let argument of args) {
			PropertyAssent.expectType(argument, "number");
		}

		// Map all arguments to valid values.
		const processedArguments = args.map((i) => mapColorValue(i));

		switch (args.length) {
			case 0:
				return new Color(0, 0, 0, 1);
			case 1:
				return new ColorFromHex(args[0], 1);
			case 2:
				return new ColorFromHex(args[0], processedArguments[1]);
			case 3:
				return new Color(...processedArguments, 1);
			case 4:
				return new Color(...processedArguments);
			default:
				throw new TypeError(
					`'Color' does not have a constructor with ${args.length} arguments.`
				);
		}
	},
};

/**
 * I'll admit, this is sort of unnecessary.
 * However, without this, users can create properties that should not exist. 😯
 * It might be a hassle to maintain, but I think it is worth it.
 */
const colorProperties = new Set(["r", "g", "b", "a", "_r", "_g", "_b", "_a"]);
/**
 * This trap is essentially used for validation. Color is a pretty simple class, so all
 * I really have to do is make sure the value is a number and map it between [0, 1]. Note that this trap is ignored
 * when initially setting all properties in the constructor. Also, who knew you could change what an Object's constructor
 * returns? 😵
 */
const proxySetTrap = {
	set(target, property, value) {
		// Again, this isn't really necessary. Although I do not want new properties being added! 😡
		if (!colorProperties.has(property)) {
			throw new TypeError(
				`Color does not have a(n) '${property}' property; cannot set value.`
			);
		}

		// Make sure the value is a number.
		PropertyAssent.expectType(value, "number");

		const mappedValue = mapColorValue(value);

		return Reflect.set(target, property, mappedValue);
	},
};

/**
 * The default export needs to be a Proxy in order for a "construct" trap to work.
 * The fact that this is a const and it's being exported feels kinda hacky,
 * but hey, Proxies are hacky in the first place! 😎
 * In the future, if you are ever going to refactor this, just know that if this is a
 * class then everything breaks.
 */
const colorProxy = new Proxy(Color, proxyConstructTrap);

export { colorProxy as default };
