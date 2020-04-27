export default class IndexBuffer {
    constructor(graphics, data) {
        this.buffer = graphics.createElementBuffer(data);
    }
}