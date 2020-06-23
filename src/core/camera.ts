import { Matrix4, Rectangle, Vector3 } from "../lib/maths.js";

function _createWVP(world: Matrix4, view: Matrix4, projection: Matrix4) {
	const mul = Matrix4.multiply;

	return mul(mul(world, view), projection);
}

enum ProjectionType {
	// eslint-disable-next-line no-unused-vars
	None,
	// eslint-disable-next-line no-unused-vars
	Orthographic,
	// eslint-disable-next-line no-unused-vars
	Perspective,
}

export default class Camera {
	get wvp() {
		return this.#wvp;
	}
	get bounds() {
		return new Rectangle(
			this.#position.x,
			this.#position.y,
			this.#width,
			this.#height
		);
	}

	#target: Vector3;
	#position: Vector3;
	#up: Vector3;

	#near: number;
	#far: number;
	#width: number;
	#height: number;

	#world: Matrix4;
	#view: Matrix4;
	#projection: Matrix4;

	#projectionType: ProjectionType;

	#wvp: Matrix4;

	constructor(width: number, height: number) {
		this.#target = Vector3.ZERO;
		this.#position = new Vector3(
			this.#target.x,
			this.#target.y,
			this.#target.z - 1
		);
		this.#up = Vector3.UP;

		this.#near = 1;
		this.#far = 16;
		this.#width = width;
		this.#height = height;

		this.#world = Matrix4.IDENTITY;
		this.#view = Matrix4.createLookAt(this.#position, this.#target, this.#up);
		this.#projection = Matrix4.createOrthographic(
			this.#width,
			this.#height,
			this.#near,
			this.#far
		);

		this.#projectionType = ProjectionType.None;

		this.#wvp = _createWVP(this.#world, this.#view, this.#projection);
	}

	public createOrthographic(
		width: number,
		height: number,
		near?: number,
		far?: number
	) {
		this.#width = width;
		this.#height = height;
		this.#near = near === undefined ? 0 : near;
		this.#far = far === undefined ? 0 : far;

		this.#projectionType = ProjectionType.Orthographic;
		this.#projection = Matrix4.createOrthographic(
			this.#width,
			this.#height,
			this.#near,
			this.#far
		);

		this.#wvp = _createWVP(this.#world, this.#view, this.#projection);

		return this;
	}

	public createPerspective(
		width: number,
		height: number,
		near?: number,
		far?: number
	) {
		this.#width = width;
		this.#height = height;
		this.#near = near === undefined ? 0 : near;
		this.#far = far === undefined ? 0 : far;

		this.#projectionType = ProjectionType.Perspective;
		this.#projection = Matrix4.createPerspective(
			this.#width,
			this.#height,
			this.#near,
			this.#far
		);

		this.#wvp = _createWVP(this.#world, this.#view, this.#projection);

		return this;
	}

	public setDimensions(width: number, height: number) {
		this.#width = width;
		this.#height = height;

		switch (this.#projectionType) {
			case ProjectionType.Orthographic:
				this.#projection = Matrix4.createOrthographic(
					this.#width,
					this.#height,
					this.#near,
					this.#far
				);
				break;
			case ProjectionType.Perspective:
				this.#projection = Matrix4.createPerspective(
					this.#width,
					this.#height,
					this.#near,
					this.#far
				);
				break;
		}

		this.#wvp = _createWVP(this.#world, this.#view, this.#projection);

		return this;
	}

	public setPosition(x: number, y: number, z: number) {
		this.#position.x = x;
		this.#position.y = y;
		this.#position.z = z;

		this.#view = Matrix4.createLookAt(this.#position, this.#target, this.#up);

		return this;
	}

	public setTarget(x: number, y: number, z: number) {
		this.#target.x = x;
		this.#target.y = y;
		this.#target.z = z;

		this.#view = Matrix4.createLookAt(this.#position, this.#target, this.#up);

		return this;
	}

	public setUp(x: number, y: number, z: number) {
		this.#up.x = x;
		this.#up.y = y;
		this.#up.z = z;

		this.#view = Matrix4.createLookAt(this.#position, this.#target, this.#up);

		return this;
	}
}
