import AttributType from "./attributeType.mjs";
import AttributeSize from "./attributeSize.mjs";

function processAttributeElements(elements) {
    let size = 0;
    let stride = 0;

    // Calculate total size and stride of all attribute elements.
    let strideOffsets = [];
    for (let element of elements) {
        size += element.size;
        strideOffsets.push(stride);

        switch (element.type) {
            case (AttributType.FLOAT):
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
        "size": size,
        "stride": stride
    };
}

export default class AttributeSchema {
    // public:
    elements; // readonly
    size; // readonly
    stride; // readonly

    constructor(elements) {
        Object.defineProperty(this, "elements", {
            "value": elements,
            "writable": false
        });

        const result = processAttributeElements(this.elements);

        Object.defineProperty(this, "size", {
            "value": result.size,
            "writable": false
        });

        Object.defineProperty(this, "stride", {
            "value": result.stride,
            "writable": false
        });
    }
}