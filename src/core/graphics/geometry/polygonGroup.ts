import DrawGroup from "../drawGroup.js";
// eslint-disable-next-line no-unused-vars
import Polygon from "./polygon.js";
// eslint-disable-next-line no-unused-vars
import PolygonEffect from "./polygonEffect.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../../lib/graphics.js";

export default abstract class PolygonGroup extends DrawGroup<Polygon> {
	protected polygonEffect: PolygonEffect;

	constructor(
		graphics: Graphics.GraphicsManager,
		polygonEffect: PolygonEffect,
		batchExecution: number,
		batchSize: number
	) {
		super(graphics, batchExecution, batchSize);

		this.polygonEffect = polygonEffect;
	}
}
