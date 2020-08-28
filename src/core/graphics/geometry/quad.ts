import Polygon from "./polygon.js";
import * as Meshes from "./meshes.js";

export default class Quad extends Polygon {
	constructor(x: number, y: number, width: number, height: number) {
		super(Meshes.SQUARE, x, y, width, height);
	}
}
