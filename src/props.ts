// eslint-disable-next-line no-unused-vars
import Graphics from "./graphics/graphicsManager.js";
import DefaultGeometry from "./graphics/geometry/defaultGeometry.js";

export default class Props {
	public readonly defaultGeometry: DefaultGeometry;

	constructor(graphics: Graphics) {
		this.defaultGeometry = new DefaultGeometry(graphics);
	}
}
