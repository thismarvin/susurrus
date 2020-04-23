export default class Color {
    constructor(r, g, b, a) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 255;
    }

    toArray() {
        return [this.r, this.g, this.b, this.a];
    }

    static fromHex(hex, a) {
        const r = (hex & 0xFF0000) >> 16;
        const g = (hex & 0xFF00) >> 8;
        const b = hex & 0xFF;

        return new Color(r, g, b, a || 255);
    }
}