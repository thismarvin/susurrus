export default class AttributeElement {
    constructor(name, size, type, stride, offset) {
        this.name = name;
        this.size = size;
        this.type = type;
        this.stride = stride;
        this.offset = offset;
    }
}