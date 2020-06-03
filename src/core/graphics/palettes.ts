import * as Graphics from "../../lib/graphics.js";

export const BASIC = {
	BLACK: new Graphics.Color(0x000000),
	WHITE: new Graphics.Color(0xffffff),
	RED: new Graphics.Color(0xff0000),
	GREEN: new Graphics.Color(0x00ff00),
	BLUE: new Graphics.Color(0x0000ff),
};
Object.freeze(BASIC);

export const PICO8 = {
	SKY_BLUE: new Graphics.Color(0x29adff),
};
Object.freeze(PICO8);
