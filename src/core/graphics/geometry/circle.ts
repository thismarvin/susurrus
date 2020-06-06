import Polygon from "./polygon.js";
import * as Meshes from "./meshes.js";

export default class Circle extends Polygon {
	public radius: number;

	constructor(x: number, y: number, radius: number) {
		super(Meshes.CIRCLE, x, y, radius * 2, radius * 2);
		this.radius = radius;
	}
}
