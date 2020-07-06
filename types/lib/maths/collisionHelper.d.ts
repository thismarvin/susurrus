import Vector2 from "./vector2.js";
import LineSegment from "./lineSegment.js";
/**
 * Represents a convex polygon.
 */
interface IShape {
	vertices: Vector2[];
	edges: LineSegment[];
}
/**
 * Returns a vector that resolves collision between two convex polygons.
 * @param a The target convex polygon that will be resolved.
 * @param b The convex polygon to resolve against.
 */
export declare function getResolution(a: IShape, b: IShape): Vector2;
export {};
//# sourceMappingURL=collisionHelper.d.ts.map
