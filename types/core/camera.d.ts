import { Matrix4, Rectangle } from "../lib/maths.js";
export default class Camera {
	#private;
	get wvp(): Matrix4;
	get bounds(): Rectangle;
	constructor();
	createOrthographic(
		width: number,
		height: number,
		near?: number,
		far?: number
	): this;
	createPerspective(
		width: number,
		height: number,
		near?: number,
		far?: number
	): this;
	setDimensions(width: number, height: number): this;
	setPosition(x: number, y: number, z: number): this;
	setTarget(x: number, y: number, z: number): this;
	setUp(x: number, y: number, z: number): this;
	setWorld(transform: Matrix4): this;
}
//# sourceMappingURL=camera.d.ts.map
