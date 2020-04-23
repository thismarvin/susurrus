export default class Buffer {
    constructor(graphics, attributeSchema, data, instanceFrequency) {
        this.attributeSchema = attributeSchema;
        this.buffer = graphics.createBuffer(data);

        this.instanceFrequency = instanceFrequency ? instanceFrequency : 0;
    }
}