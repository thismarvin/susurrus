import AttributeElement from "./attributeElement.js";
export default class AttributeSchema {
    readonly elements: AttributeElement[];
    readonly size: number;
    readonly stride: number;
    constructor(elements: AttributeElement[]);
}
