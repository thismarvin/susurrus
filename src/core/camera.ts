import * as Maths from "../lib/maths.js";

export default class Camera {
	public world: Maths.MatrixTransform;
	public view: Maths.MatrixTransform;
	public projection: Maths.MatrixTransform;
	public worldViewProjection: Maths.MatrixTransform;

	constructor(width: number, height: number) {
		this.world = Maths.MatrixTransform.createTranslation(0, 0, 0);
		this.view = Maths.MatrixTransform.createLookAt(
			new Maths.Vector3(0, 0, 1),
			new Maths.Vector3(0, 0, 0),
			new Maths.Vector3(0, 1, 0)
		);
		this.projection = Maths.MatrixTransform.createOrthographic(
			width,
			height,
			0,
			16
		);

		this.worldViewProjection = Maths.MatrixTransform.getIdentity();

		this.updateWorldViewProjection();
	}

	public setBounds(width: number, height: number) {
		this.projection = Maths.MatrixTransform.createOrthographic(
			width,
			height,
			0,
			16
		);

		this.updateWorldViewProjection();
	}

	// ? I really do not know the best way to modify the camera moving forward.
	// ? This works fine for now, but you gotta think of a better way! 😯
	public setLocation(x: number, y: number) {
		this.view = Maths.MatrixTransform.createLookAt(
			new Maths.Vector3(x, y, 1),
			new Maths.Vector3(x, y, 0),
			new Maths.Vector3(0, 1, 0)
		);

		this.updateWorldViewProjection();
	}

	private updateWorldViewProjection() {
		this.worldViewProjection = Maths.Matrix.mult(
			Maths.Matrix.mult(this.view, this.world),
			this.projection
		);
	}
}
