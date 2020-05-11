import Color from "./color.js";
const colors = {
	Black: new Color(0x000000),
	White: new Color(0xffffff),
	Red: new Color(0xff0000),
	Green: new Color(0x00ff00),
	Blue: new Color(0x0000ff),
	SkyBlue: new Color(0x29adff),
};
Object.freeze(colors);
export { colors as default };
