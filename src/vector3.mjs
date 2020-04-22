export default class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    multiply(value) {
        this.x *= value;
        this.y *= value;
        this.z *= value;
    }

    divide(value) {
        this.x /= value;
        this.y /= value;
        this.z /= value;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const magnitude = this.length();
        if (magnitude > 0) {
            this.divide(magnitude);
        }
    }

    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static cross(a, b) {
        const x = a.y * b.z - b.y * a.z;
        const y = -(a.x * b.z - b.x * a.z);
        const z = a.x * b.y - b.x * a.y;

        return new Vector3(x, y, z);
    }

    static subtract(a, b) {
        const x = a.x - b.x;
        const y = a.y - b.y;
        const z = a.z - b.z;

        return new Vector3(x, y, z);
    }
}