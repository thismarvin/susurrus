export default class Color {
	#private;
	get r(): number;
	set r(value: number);
	get g(): number;
	set g(value: number);
	get b(): number;
	set b(value: number);
	get a(): number;
	set a(value: number);
	constructor(hex: string | number, a?: number);
	fromRGB(r: number, g: number, b: number, a?: number): this;
	multiply(value: number): void;
	toArray(): number[];
	toString(): string;
	private validateValue;
}
