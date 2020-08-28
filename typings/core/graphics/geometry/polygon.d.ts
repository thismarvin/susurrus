import * as Graphics from "../../../lib/graphics.js";
import * as Maths from "../../../lib/maths.js";
import GeometryData from "./geometryData.js";
import Camera from "../../camera.js";
export default abstract class Polygon {
	#private;
	get x(): number;
	set x(value: number);
	get y(): number;
	set y(value: number);
	get z(): number;
	set z(value: number);
	get width(): number;
	set width(value: number);
	get height(): number;
	set height(value: number);
	get translation(): Maths.Vector3;
	set translation(value: Maths.Vector3);
	get scale(): Maths.Vector3;
	set scale(value: Maths.Vector3);
	get rotationOffset(): Maths.Vector3;
	set rotationOffset(value: Maths.Vector3);
	get rotation(): number;
	set rotation(value: number);
	get color(): Graphics.Color;
	set color(value: Graphics.Color);
	get position(): Maths.Vector3;
	get aabb(): Maths.Rectangle;
	constructor(
		mesh: Graphics.Mesh,
		x: number,
		y: number,
		width: number,
		height: number
	);
	setPosition(x: number, y: number, z: number): this;
	attachMesh(mesh: Graphics.Mesh): this;
	attachGeometry(geometry: GeometryData): this;
	attachEffect(effect: Graphics.Effect): this;
	/**
	 * Creates a new GeometryData object from the prexsisting mesh, and attaches it to the polygon.
	 * @param graphics The current theater's GraphicsManager.
	 */
	createGeometry(graphics: Graphics.GraphicsManager): this;
	/**
	 * Creates a buffer that handles model specific transformations and properties.
	 * @param graphics The current theater's GraphicsManager.
	 */
	createModelBuffer(graphics: Graphics.GraphicsManager): this;
	/**
	 * Creates and returns a 4x4 matrix that represents all of the polygon's transformations.
	 */
	calculateTransform(): Maths.Matrix4;
	/**
	 * Updates the model buffer to reflect any new changes.
	 */
	applyChanges(): void;
	draw(graphics: Graphics.GraphicsManager, camera: Camera): void;
	private updateModelBuffer;
}
//# sourceMappingURL=polygon.d.ts.map
