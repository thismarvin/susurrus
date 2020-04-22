export default class DynamicMatrix {
    constructor(rows, columns, data) {
        this.rows = rows;
        this.columns = columns;

        this.data = data ? data : new Array(this.rows * this.columns).fill(0);
    }
}