import * as PropertyAssent from "../utilities/propertyAssent.mjs";

export default class DynamicMatrix {
    //#region Class Properties
    // public:
    // =======================
    // rows;
    // columns;
    // data;

    // private:
    // =======================
    // _rows;
    // _columns;
    // _data;
    //#endregion

    constructor(rows, columns, data) {
        this._rows = rows;
        this._columns = columns;
        this._data = new Array(this._rows * this._columns).fill(0);

        Object.defineProperty(this, "rows", {
            get() {
                return this._rows;
            }
        });

        Object.defineProperty(this, "columns", {
            get() {
                return this._columns;
            }
        });

        Object.defineProperty(this, "data", {
            get() {
                return this._data;
            }
        });

        if (data !== undefined) {
            this.setData(data);
        }
    }

    get(x, y) {
        return this.data[this.columns * y + x];
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

        this._data = data.slice(0);
    }

    set(x, y, value) {
        PropertyAssent.expectType(value, "number");

        this._data[this.columns * y + x] = value;
    }

    transpose() {
        const transposed = new Array(this.rows * this.columns).fill(0);
        const newRows = this.columns;
        const newColumns = this.rows;

        for (let y = 0; y < newRows; y++) {
            for (let x = 0; x < newColumns; x++) {
                transposed[newColumns * y + x] = this.data[this.columns * x + y];
            }
        }

        this._data = transposed;
        this._rows = newRows;
        this._columns = newColumns;
    }

    add(a) {
        // First check if 'a' is just a number.
        if (PropertyAssent.expectType(a, "number", {
                "throwError": false
            })) {
            for (let i = 0; i < this.rows * this.columns; i++) {
                this._data[i] += a;
            }
            return;
        }

        // Otherwise, 'a' must be a matrix.
        PropertyAssent.expectInstance(a, DynamicMatrix);

        // Make sure we can even add the matrices.
        if (this.rows !== a.rows || this.columns !== a.columns) {
            throw new TypeError("Both matrices are not the same size; cannot perform operation.")
        }

        for (let i = 0; i < this.rows * this.columns; i++) {
            this._data[i] += a.data[i];
        }
    }

    subtract(a) {
        // First check if 'a' is just a number.
        if (PropertyAssent.expectType(a, "number", {
                "throwError": false
            })) {
            for (let i = 0; i < this.rows * this.columns; i++) {
                this._data[i] -= a;
            }
            return;
        }

        // Otherwise, 'a' must be a matrix.
        PropertyAssent.expectInstance(a, DynamicMatrix);

        // Make sure we can even subtract the matrices.
        if (this.rows !== a.rows || this.columns !== a.columns) {
            throw new TypeError("Both matrices are not the same size; cannot perform operation.")
        }

        for (let i = 0; i < this.rows * this.columns; i++) {
            this._data[i] -= a.data[i];
        }
    }

    multiply(a) {
        // First check if 'a' is just a number.
        if (PropertyAssent.expectType(a, "number", {
                "throwError": false
            })) {
            for (let i = 0; i < this.rows * this.columns; i++) {
                this._data[i] *= a;
            }
            return;
        }

        // Otherwise, 'a' must be a matrix.
        PropertyAssent.expectInstance(a, DynamicMatrix);

        // Make sure we can even multiply the matrices.
        if (this.columns !== a.rows) {
            throw new TypeError(`The matrix provided must have ${this.columns} rows; cannot multiply matrices.`);
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

    divide(a) {
        PropertyAssent.expectType(a, "number");

        const inverse = 1 / a;
        for (let i = 0; i < this.rows * this.columns; i++) {
            this._data[i] *= inverse;
        }
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