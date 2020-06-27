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
	#projectionType: ProjectionType;

	#world: Matrix4;
	#view: Matrix4;
	#projection: Matrix4;

	#wvp: Matrix4;

	constructor() {
		this.#target = Vector3.ZERO;
		this.#position = new Vector3(
			this.#target.x,
			this.#target.y,
			this.#target.z + 1
		);
		this.#up = Vector3.UP;

		this.#near = 0;
		this.#far = 0;
		this.#width = 0;
		this.#height = 0;
		this.#projectionType = ProjectionType.None;

		this.#world = Matrix4.IDENTITY;
		this.#view = Matrix4.createLookAt(this.#position, this.#target, this.#up);
		this.#projection = Matrix4.IDENTITY;

		this.#wvp = Matrix4.IDENTITY;
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
		this.#wvp = _createWVP(this.#world, this.#view, this.#projection);

		return this;
	}

	public setTarget(x: number, y: number, z: number) {
		this.#target.x = x;
		this.#target.y = y;
		this.#target.z = z;

		this.#view = Matrix4.createLookAt(this.#position, this.#target, this.#up);
		this.#wvp = _createWVP(this.#world, this.#view, this.#projection);

		return this;
	}

	public setUp(x: number, y: number, z: number) {
		this.#up.x = x;
		this.#up.y = y;
		this.#up.z = z;

		this.#view = Matrix4.createLookAt(this.#position, this.#target, this.#up);
		this.#wvp = _createWVP(this.#world, this.#view, this.#projection);

		return this;
	}

	public setWorld(transform: Matrix4) {
		this.#world = transform;

		this.#wvp = _createWVP(this.#world, this.#view, this.#projection);

		return this;
	}
}
