import * as Maths from "../lib/maths.js";

export default class Camera {
	public world: Maths.Matrix4;
	public view: Maths.Matrix4;
	public projection: Maths.Matrix4;
	public worldViewProjection: Maths.Matrix4;

	constructor(width: number, height: number) {
		this.world = Maths.Matrix4.identity();
		this.view = Maths.Matrix4.createLookAt(
			new Maths.Vector3(0, 0, 1),
			new Maths.Vector3(0, 0, 0),
			new Maths.Vector3(0, 1, 0)
		);
		this.projection = Maths.Matrix4.createOrthographic(width, height, 1, 16);
		this.worldViewProjection = Maths.Matrix4.identity();

		this.updateWorldViewProjection();
	}

	public setBounds(width: number, height: number) {
		this.projection = Maths.Matrix4.createOrthographic(width, height, 0, 16);

		this.updateWorldViewProjection();
	}

	// ? I really do not know the best way to modify the camera moving forward.
	// ? This works fine for now, but you gotta think of a better way! 😯
	public setLocation(x: number, y: number) {
		this.view = Maths.Matrix4.createLookAt(
			new Maths.Vector3(x, y, 1),
			new Maths.Vector3(x, y, 0),
			new Maths.Vector3(0, 1, 0)
		);

		this.updateWorldViewProjection();
	}

	private updateWorldViewProjection() {
		this.worldViewProjection = Maths.Matrix4.multiply(
			Maths.Matrix4.multiply(this.world, this.view),
			this.projection
		);
	}
}
