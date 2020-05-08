export default class DynamicMatrix {
    #private;
    get rows(): number;
    get columns(): number;
    get data(): number[];
    constructor(rows: number, columns: number, data?: number[]);
    get(x: number, y: number): number;
    setData(data: number[]): void;
    set(x: number, y: number, value: number): void;
    transpose(): void;
    add(a: number | DynamicMatrix): DynamicMatrix;
    subtract(a: number | DynamicMatrix): DynamicMatrix;
    multiply(a: number | DynamicMatrix): DynamicMatrix;
    divide(a: number): DynamicMatrix;
    toString(): string;
}
