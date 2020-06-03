// eslint-disable-next-line no-unused-vars
import * as Graphics from "../lib/graphics.js";
import DefaultGeometry from "./graphics/geometry/defaultGeometry.js";

export default class Props {
	public readonly defaultGeometry: DefaultGeometry;

	constructor(graphics: Graphics.GraphicsManager) {
		this.defaultGeometry = new DefaultGeometry(graphics);
	}
}
