import VertexBuffer from "./vertexBuffer.js";
import IndexBuffer from "./indexBuffer.js";
import Graphics from "./graphics.js";
export default class PolygonData {
    readonly vertexBuffer: VertexBuffer;
    readonly indexBuffer: IndexBuffer;
    readonly totalVertices: number;
    readonly totalTriangles: number;
    constructor(graphics: Graphics, vertices: number[], indices: number[]);
}
