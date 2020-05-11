import Matrix from "../maths/matrix.js";
import Vector3 from "../maths/vector3.js";
export default class Camera {
	constructor() {
		this.world = Matrix.createTranslation(0, 0, 0);
		this.view = Matrix.createLookAt(
			new Vector3(0, 0, 1),
			new Vector3(0, 0, 0),
			new Vector3(0, 1, 0)
		);
		this.projection = Matrix.createOrthographic(4, 4, 0, 16);
		this.worldViewProjection = this.view
			.multiply(this.world)
			.multiply(this.projection);
	}
}
