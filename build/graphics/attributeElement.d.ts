export default class AttributeElement {
    readonly name: string;
    readonly size: number;
    readonly type: number;
    stride: number;
    offset: number;
    constructor(name: string, size: number, type: number);
}
