import AttributType from "./attributeType.js";
import AttributeSize from "./attributeSize.js";
function processAttributeElements(elements) {
    let size = 0;
    let stride = 0;
    // Calculate total size and stride of all attribute elements.
    let strideOffsets = [];
    for (let element of elements) {
        size += element.size;
        strideOffsets.push(stride);
        switch (element.type) {
            case AttributType.FLOAT:
                stride += AttributeSize.FLOAT * element.size;
                break;
            default:
                throw new TypeError("Unsupported attribute type.");
        }
    }
    // Update each element to reflect the schema's stride.
    for (let i = 0; i < elements.length; i++) {
        elements[i].stride = stride;
        elements[i].offset = strideOffsets[i];
    }
    return {
        size: size,
        stride: stride,
    };
}
export default class AttributeSchema {
    constructor(elements) {
        this.elements = elements;
        const result = processAttributeElements(this.elements);
        this.size = result.size;
        this.stride = result.stride;
        Object.defineProperty(this, "elements", {
            writable: false,
        });
        Object.defineProperty(this, "size", {
            writable: false,
        });
        Object.defineProperty(this, "stride", {
            writable: false,
        });
    }
}
