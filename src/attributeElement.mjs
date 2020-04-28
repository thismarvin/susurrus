export default class AttributeElement {
    constructor(name, size, type) {
        this.name = name;
        this.size = size;
        this.type = type;
        this.stride = 0;
        this.offset = 0;
    }
}