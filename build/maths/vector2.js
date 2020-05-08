export default class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toArray() {
        return [this.x, this.y];
    }
}
