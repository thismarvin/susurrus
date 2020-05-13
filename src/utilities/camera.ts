import MatrixTransform from "../maths/matrixTransform.js";
import Vector3 from "../maths/vector3.js";
import Matrix from "../maths/matrix.js";

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

		this.worldViewProjection = Matrix.mult(
			Matrix.mult(this.view, this.world),
			this.projection
		);
	}

	public setBounds(width: number, height: number) {
		this.projection = MatrixTransform.createOrthographic(width, height, 0, 16);

		this.worldViewProjection = Matrix.mult(
			Matrix.mult(this.view, this.world),
			this.projection
		);
	}
}
