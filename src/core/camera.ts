import * as Maths from "../lib/maths.js";

export default class Camera {
	public world: Maths.Matrix4;
	public view: Maths.Matrix4;
	public projection: Maths.Matrix4;
	public worldViewProjection: Maths.Matrix4;

	constructor(width: number, height: number) {
		this.world = Maths.Transforms.identity();
		this.view = Maths.Transforms.createLookAt(
			new Maths.Vector3(0, 0, 1),
			new Maths.Vector3(0, 0, 0),
			new Maths.Vector3(0, 1, 0)
		);

		this.projection = Maths.Transforms.createOrthographic2(
			-width / 2,
			width / 2,
			-height / 2,
			height / 2,
			1,
			16
		);

		this.worldViewProjection = Maths.Transforms.identity();

		this.updateWorldViewProjection();
	}

	public setBounds(width: number, height: number) {
		this.projection = Maths.Transforms.createOrthographic(width, height, 0, 16);

		this.updateWorldViewProjection();
	}

	// ? I really do not know the best way to modify the camera moving forward.
	// ? This works fine for now, but you gotta think of a better way! 😯
	public setLocation(x: number, y: number) {
		this.view = Maths.Transforms.createLookAt(
			new Maths.Vector3(x, y, 1),
			new Maths.Vector3(x, y, 0),
			new Maths.Vector3(0, 1, 0)
		);

		this.updateWorldViewProjection();
	}

	private updateWorldViewProjection() {
		this.worldViewProjection = Maths.M4H.multiply(
			Maths.M4H.multiply(this.world, this.view),
			this.projection
		);
	}
}
