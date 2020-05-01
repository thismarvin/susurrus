import * as PropertyAssent from "../utilities/propertyAssent.mjs";

export default class DynamicMatrix {
    // public:
    rows; // readonly;
    columns; // readonly;
    data;

    // private:
    _data;

    constructor(rows, columns, data) {
        Object.defineProperty(this, "rows", {
            "value": rows,
            "writable": false
        });

        Object.defineProperty(this, "columns", {
            "value": columns,
            "writable": false
        });

        Object.defineProperty(this, "data", {
            get() {
                return this._data;
            }
        });

        this._data = new Array(this.rows * this.columns).fill(0);

        if (data !== undefined) {
            this.setData(data);
        }
    }

    get(x, y) {
        return this._data[this.columns * y + x];
    }

    /**
     * 
     * @param {Array} data 
     */
    setData(data) {
        PropertyAssent.expectType(data, "array");

        if (data.length !== this.rows * this.columns) {
            throw new TypeError("The data does not match the dimensions of the matrix.");
        }

        this._data = data;
    }

    set(x, y, value) {
        PropertyAssent.expectType(value, "number");

        this._data[this.columns * y + x] = value;
    }

    multiply(a) {
        PropertyAssent.expectInstance(a, DynamicMatrix);

        if (this.columns !== a.rows) {
            throw new TypeError("Cannot multiply matrices.");
        }

        const result = new DynamicMatrix(this.rows, a.columns);

        for (let aY = 0; aY < this.rows; aY++) {
            for (let aX = 0; aX < this.columns; aX++) {
                for (let bX = 0; bX < a.columns; bX++) {
                    result.set(bX, aY, result.get(bX, aY) + (this.get(aX, aY) * a.get(bX, aX)));
                }
            }
        }

        this._data = result.data;
    }

    toString() {
        let string = "";

        for (let i = 0; i < this._data.length; i += this.columns) {
            string += `( ${this._data[i]}`;
            for (let j = 1; j < this.columns; j++) {
                string += ` ${this._data[i + j]}`;
            }

            string += " )";

            if (i !== this._data.length - this.columns) {
                string += " ";
            }
        }

        return string;
    }
}