export default class AttributeElement {
    //#region Class Properties
    // public:
    // =======================
    // name; // readonly
    // size; // readonly
    // type; // readonly
    // stride;
    // offset;
    //#endregion

    constructor(name, size, type) {
        Object.defineProperty(this, "name", {
            "value": name,
            "writable": false
        });

        Object.defineProperty(this, "size", {
            "value": size,
            "writable": false
        });

        Object.defineProperty(this, "type", {
            "value": type,
            "writable": false
        });

        this.stride = 0;
        this.offset = 0;
    }
}