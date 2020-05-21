import MatrixTransform from "./maths/matrixTransform.js";
import Vector3 from "./maths/vector3.js";
import Matrix from "./maths/matrix.js";

export default class Camera {
	public world: MatrixTransform;
	public view: MatrixTransform;
	public projection: MatrixTransform;
	public worldViewProjection: MatrixTransform;

	constructor(width: number, height: number) {
		this.world = MatrixTransform.createTranslation(0, 0, 0);
		this.view = MatrixTransform.createLookAt(
			new Vector3(0, 0, 1),
			new Vector3(0, 0, 0),
			new Vector3(0, 1, 0)
		);
		this.projection = MatrixTransform.createOrthographic(width, height, 0, 16);

		this.worldViewProjection = MatrixTransform.getIdentity();

		this.updateWorldViewProjection();
	}

	public setBounds(width: number, height: number) {
		this.projection = MatrixTransform.createOrthographic(width, height, 0, 16);

		this.updateWorldViewProjection();
	}

	// ? I really do not know the best way to modify the camera moving forward.
	// ? This works fine for now, but you gotta think of a better way! 😯
	public setLocation(x: number, y: number) {
		this.view = MatrixTransform.createLookAt(
			new Vector3(x, y, 1),
			new Vector3(x, y, 0),
			new Vector3(0, 1, 0)
		);

		this.updateWorldViewProjection();
	}

	private updateWorldViewProjection() {
		this.worldViewProjection = Matrix.mult(
			Matrix.mult(this.view, this.world),
			this.projection
		);
	}
}
