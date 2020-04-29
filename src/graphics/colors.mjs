import Color from "./color.mjs";

const colors = {
    "Black": new Color(0x000000),
    "White": new Color(0xFFFFFF),
    "Red": new Color(0xFF0000),
    "Green": new Color(0x00FF00),
    "Blue": new Color(0x0000FF),

    "SkyBlue": new Color(0x29ADFF),
}

Object.freeze(colors);

export {
    colors as
    default
};