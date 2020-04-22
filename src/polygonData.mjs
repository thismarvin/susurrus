export default class PolygonData {
    constructor(graphics, vertices, indices) {
        this.vertexBuffer = graphics.createBuffer(vertices);
        this.indexBuffer = null;
    }
}