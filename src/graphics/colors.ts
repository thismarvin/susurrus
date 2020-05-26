import Color from "./color.js";

const COLORS = {
	BLACK: new Color(0x000000),
	WHITE: new Color(0xffffff),
	RED: new Color(0xff0000),
	GREEN: new Color(0x00ff00),
	BLUE: new Color(0x0000ff),

	SKY_BLUE: new Color(0x29adff),
};

Object.freeze(COLORS);

export { COLORS as default };
