var __classPrivateFieldSet =
	(this && this.__classPrivateFieldSet) ||
	function (receiver, privateMap, value) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to set private field on non-instance");
		}
		privateMap.set(receiver, value);
		return value;
	};
var __classPrivateFieldGet =
	(this && this.__classPrivateFieldGet) ||
	function (receiver, privateMap) {
		if (!privateMap.has(receiver)) {
			throw new TypeError("attempted to get private field on non-instance");
		}
		return privateMap.get(receiver);
	};
var _r, _g, _b, _a;
const RGBStep = 1 / 255;
export default class Color {
	constructor(hex, a) {
		_r.set(this, void 0);
		_g.set(this, void 0);
		_b.set(this, void 0);
		_a.set(this, void 0);
		__classPrivateFieldSet(this, _r, 0);
		__classPrivateFieldSet(this, _g, 0);
		__classPrivateFieldSet(this, _b, 0);
		__classPrivateFieldSet(this, _a, 1);
		switch (typeof hex) {
			case "number": {
				__classPrivateFieldSet(
					this,
					_r,
					this.validateValue(((hex & 0xff0000) >> 16) / 255)
				);
				__classPrivateFieldSet(
					this,
					_g,
					this.validateValue(((hex & 0xff00) >> 8) / 255)
				);
				__classPrivateFieldSet(
					this,
					_b,
					this.validateValue((hex & 0xff) / 255)
				);
				break;
			}
			case "string": {
				const hexAsNumber = parseInt(hex, 16);
				__classPrivateFieldSet(
					this,
					_r,
					this.validateValue(((hexAsNumber & 0xff0000) >> 16) / 255)
				);
				__classPrivateFieldSet(
					this,
					_g,
					this.validateValue(((hexAsNumber & 0xff00) >> 8) / 255)
				);
				__classPrivateFieldSet(
					this,
					_b,
					this.validateValue((hexAsNumber & 0xff) / 255)
				);
				break;
			}
		}
		if (a !== undefined) {
			this.multiply(this.validateValue(a));
		}
	}
	get r() {
		return __classPrivateFieldGet(this, _r);
	}
	set r(value) {
		__classPrivateFieldSet(this, _r, this.validateValue(value));
	}
	get g() {
		return __classPrivateFieldGet(this, _g);
	}
	set g(value) {
		__classPrivateFieldSet(this, _g, this.validateValue(value));
	}
	get b() {
		return __classPrivateFieldGet(this, _b);
	}
	set b(value) {
		__classPrivateFieldSet(this, _b, this.validateValue(value));
	}
	get a() {
		return __classPrivateFieldGet(this, _a);
	}
	set a(value) {
		__classPrivateFieldSet(this, _a, this.validateValue(value));
	}
	fromRGB(r, g, b, a) {
		__classPrivateFieldSet(this, _r, this.validateValue(r / 255));
		__classPrivateFieldSet(this, _g, this.validateValue(g / 255));
		__classPrivateFieldSet(this, _b, this.validateValue(b / 255));
		if (a !== undefined) {
			this.multiply(this.validateValue(a));
		}
		return this;
	}
	multiply(value) {
		__classPrivateFieldSet(
			this,
			_r,
			this.validateValue(__classPrivateFieldGet(this, _r) * value)
		);
		__classPrivateFieldSet(
			this,
			_g,
			this.validateValue(__classPrivateFieldGet(this, _g) * value)
		);
		__classPrivateFieldSet(
			this,
			_b,
			this.validateValue(__classPrivateFieldGet(this, _b) * value)
		);
		__classPrivateFieldSet(
			this,
			_a,
			this.validateValue(__classPrivateFieldGet(this, _a) * value)
		);
	}
	toArray() {
		return [
			__classPrivateFieldGet(this, _r),
			__classPrivateFieldGet(this, _g),
			__classPrivateFieldGet(this, _b),
			__classPrivateFieldGet(this, _a),
		];
	}
	toString() {
		const rAsRGB = Math.floor(__classPrivateFieldGet(this, _r) * 255);
		const gAsRGB = Math.floor(__classPrivateFieldGet(this, _g) * 255);
		const bAsRGB = Math.floor(__classPrivateFieldGet(this, _b) * 255);
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
		return `(${rAsRGB} ${gAsRGB} ${bAsRGB}) ${__classPrivateFieldGet(
			this,
			_a
		).toFixed(4)}, 0x${rString}${gString}${bString}`;
	}
	validateValue(value) {
		if (value < RGBStep) {
			return 0;
		}
		if (value > 1) {
			return 1;
		}
		return Math.floor(value / RGBStep) * RGBStep;
	}
}
(_r = new WeakMap()),
	(_g = new WeakMap()),
	(_b = new WeakMap()),
	(_a = new WeakMap());
