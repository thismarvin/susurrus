import AttributTypes from "./attributeTypes.mjs";
import AttributeSizes from "./attributeSizes.mjs";

function processAttributeElements(elements) {
    let size = 0;
    let stride = 0;

    // Calculate total size and stride of all attribute elements.
    let strideOffsets = [];
    for (let element of elements) {
        size += element.size;
        strideOffsets.push(stride);

        switch (element.type) {
            case (AttributTypes.FLOAT):
                stride += AttributeSizes.FLOAT * element.size;
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
        "size": size,
        "stride": stride
    };
}

export default class AttributeSchema {
    constructor(elements) {
        this.elements = elements;

        const result = processAttributeElements(this.elements);
        this.size = result.size;
        this.stride = result.stride;
    }
}