import AttributeSchema from "./attributeSchema.js";
import VertexBuffer from "./vertexBuffer.js";
import Vector3 from "../maths/vector3.js";
import Color from "./color.js";
import PolygonData from "./polygonData.js";
import Graphics from "./graphics.js";
import Effect from "./effect.js";
import Camera from "../utilities/camera.js";
export default class Polygon {
    #private;
    readonly geometry: PolygonData;
    readonly attributeSchema: AttributeSchema;
    readonly transformBuffer: VertexBuffer;
    get position(): Vector3;
    set position(value: Vector3);
    get scale(): Vector3;
    set scale(value: Vector3);
    get rotationOffset(): Vector3;
    set rotationOffset(value: Vector3);
    get rotation(): number;
    set rotation(value: number);
    get color(): Color;
    set color(value: Color);
    constructor(graphics: Graphics, geometry: PolygonData);
    applyChanges(): void;
    draw(graphics: Graphics, effect: Effect, camera: Camera): void;
    private updateBuffer;
}
