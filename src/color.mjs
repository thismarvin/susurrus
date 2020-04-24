class Color {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;

        return new Proxy(this, handler);
    }

    toArray() {
        return [this.r, this.g, this.b, this.a];
    }

    toString() {
        return `( ${parseInt(this.r * 255)} ${parseInt(this.g * 255)} ${parseInt(this.b * 255)} ${parseInt(this.a * 255)} )`;
    }
}

class HexColor {
    constructor(hex, a) {
        const r = ((hex & 0xFF0000) >> 16) / 255;
        const g = ((hex & 0xFF00) >> 8) / 255;
        const b = (hex & 0xFF) / 255;
        return new Color(r, g, b, a);
    }
}

function processColorValue(value) {
    // A valid value must be within the range [0, 1]!

    // If the value is less than one, we can assume the color has already been mapped.
    // Just check the lower bound to be safe. 😉
    if (value < 1) {
        return Math.max(0, value);
    }

    // The value probably has not been mapped, so lets map the color and check both bounds.
    let result = value / 255;
    result = Math.max(0, result);
    result = Math.min(1, result);

    return result;
};

const gettableProperties = new Set(["r", "g", "b", "a", "toArray", "toString"]);
const modifiableProperties = new Set(["r", "g", "b", "a"]);

const handler = {
    construct(_, args) {
        // Make sure all arguments are numbers.
        for (let argument of args) {
            if (typeof argument !== "number") {
                throw new TypeError("Expected a number; invalid constructor arguments.");
            }
        }

        const processedArguments = args.map(i => processColorValue(i));

        switch (args.length) {
            case 0:
                return new Color();
            case 1:
                return new HexColor(args[0], 1);
            case 2:
                return new HexColor(args[0], processedArguments[1]);
            case 3:
                return new Color(...processedArguments);
            case 4:
                return new Color(...processedArguments);
            default:
                throw new Error(`'Color' does not have a constructor with ${args.length} arguments.`);
        }
    },
    set(object, property, value, _) {
        // Make sure the property exists.
        if (!gettableProperties.has(property)) {
            throw new Error("Cannot set value of a property that does not exist.");
        }

        // Make sure the property is modifiable.
        if (!modifiableProperties.has(property)) {
            throw new Error(`Cannot set value of '${property}' property.`);
        }

        // Make sure the value is a number.
        if (typeof value !== "number") {
            throw new TypeError("Expected a nummber; invalid value.");
        }

        // Process the value and then set it to its respective property.
        return Reflect.set(object, property, processColorValue(value));
    },
    get(object, property, _) {
        // Make sure the property even exists.
        if (!gettableProperties.has(property)) {
            throw new Error("Cannot get value of a property that does not exist.");
        }

        // Premultiply Alpha
        switch (property) {
            case "r":
                return object.r * object.a;
            case "g":
                return object.g * object.a;
            case "b":
                return object.b * object.a;
            default:
                return Reflect.get(...arguments);
        }
    }
}

const colorProxy = new Proxy(Color, handler);

export {
    colorProxy as
    default
};