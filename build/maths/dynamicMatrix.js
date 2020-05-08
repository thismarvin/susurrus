var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _rows, _columns, _data;
import * as PropertyAssent from "../utilities/propertyAssent.js";
export default class DynamicMatrix {
    constructor(rows, columns, data) {
        _rows.set(this, void 0);
        _columns.set(this, void 0);
        _data.set(this, void 0);
        __classPrivateFieldSet(this, _rows, rows);
        __classPrivateFieldSet(this, _columns, columns);
        __classPrivateFieldSet(this, _data, new Array(__classPrivateFieldGet(this, _rows) * __classPrivateFieldGet(this, _columns)).fill(0));
        if (data !== undefined) {
            this.setData(data);
        }
    }
    get rows() {
        return __classPrivateFieldGet(this, _rows);
    }
    get columns() {
        return __classPrivateFieldGet(this, _columns);
    }
    get data() {
        return __classPrivateFieldGet(this, _data);
    }
    get(x, y) {
        return this.data[this.columns * y + x];
    }
    setData(data) {
        PropertyAssent.expectType(data, "array");
        if (data.length !== this.rows * this.columns) {
            throw new TypeError("The data does not match the dimensions of the matrix.");
        }
        __classPrivateFieldSet(this, _data, data.slice(0));
    }
    set(x, y, value) {
        PropertyAssent.expectType(value, "number");
        __classPrivateFieldGet(this, _data)[this.columns * y + x] = value;
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
        __classPrivateFieldSet(this, _data, transposed);
        __classPrivateFieldSet(this, _rows, newRows);
        __classPrivateFieldSet(this, _columns, newColumns);
    }
    add(a) {
        // First check if 'a' is just a number.
        if (PropertyAssent.expectType(a, "number", {
            throwError: false,
        })) {
            const aNumber = a;
            for (let i = 0; i < this.rows * this.columns; i++) {
                __classPrivateFieldGet(this, _data)[i] += aNumber;
            }
            return this;
        }
        // Otherwise, 'a' must be a matrix.
        PropertyAssent.expectInstance(a, DynamicMatrix);
        const aMatrix = a;
        // Make sure we can even add the matrices.
        if (this.rows !== aMatrix.rows || this.columns !== aMatrix.columns) {
            throw new TypeError("Both matrices are not the same size; cannot perform operation.");
        }
        for (let i = 0; i < this.rows * this.columns; i++) {
            __classPrivateFieldGet(this, _data)[i] += aMatrix.data[i];
        }
        return this;
    }
    subtract(a) {
        // First check if 'a' is just a number.
        if (PropertyAssent.expectType(a, "number", {
            throwError: false,
        })) {
            const aNumber = a;
            for (let i = 0; i < this.rows * this.columns; i++) {
                __classPrivateFieldGet(this, _data)[i] -= aNumber;
            }
            return this;
        }
        // Otherwise, 'a' must be a matrix.
        PropertyAssent.expectInstance(a, DynamicMatrix);
        const aMatrix = a;
        // Make sure we can even subtract the matrices.
        if (this.rows !== aMatrix.rows || this.columns !== aMatrix.columns) {
            throw new TypeError("Both matrices are not the same size; cannot perform operation.");
        }
        for (let i = 0; i < this.rows * this.columns; i++) {
            __classPrivateFieldGet(this, _data)[i] -= aMatrix.data[i];
        }
        return this;
    }
    multiply(a) {
        // First check if 'a' is just a number.
        if (PropertyAssent.expectType(a, "number", {
            throwError: false,
        })) {
            const aNumber = a;
            for (let i = 0; i < this.rows * this.columns; i++) {
                __classPrivateFieldGet(this, _data)[i] *= aNumber;
            }
            return this;
        }
        // Otherwise, 'a' must be a matrix.
        PropertyAssent.expectInstance(a, DynamicMatrix);
        const aMatrix = a;
        // Make sure we can even multiply the matrices.
        if (this.columns !== aMatrix.rows) {
            throw new TypeError(`The matrix provided must have ${this.columns} rows; cannot multiply matrices.`);
        }
        const result = new DynamicMatrix(this.rows, aMatrix.columns);
        for (let aY = 0; aY < this.rows; aY++) {
            for (let aX = 0; aX < this.columns; aX++) {
                for (let bX = 0; bX < aMatrix.columns; bX++) {
                    result.set(bX, aY, result.get(bX, aY) + this.get(aX, aY) * aMatrix.get(bX, aX));
                }
            }
        }
        __classPrivateFieldSet(this, _data, result.data);
        return this;
    }
    divide(a) {
        PropertyAssent.expectType(a, "number");
        const inverse = 1 / a;
        for (let i = 0; i < this.rows * this.columns; i++) {
            __classPrivateFieldGet(this, _data)[i] *= inverse;
        }
        return this;
    }
    toString() {
        let string = "";
        for (let i = 0; i < __classPrivateFieldGet(this, _data).length; i += this.columns) {
            string += `( ${__classPrivateFieldGet(this, _data)[i]}`;
            for (let j = 1; j < this.columns; j++) {
                string += ` ${__classPrivateFieldGet(this, _data)[i + j]}`;
            }
            string += " )";
            if (i !== __classPrivateFieldGet(this, _data).length - this.columns) {
                string += " ";
            }
        }
        return string;
    }
}
_rows = new WeakMap(), _columns = new WeakMap(), _data = new WeakMap();
