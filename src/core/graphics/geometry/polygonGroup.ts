import DrawGroup from "../drawGroup.js";
// eslint-disable-next-line no-unused-vars
import Polygon from "./polygon.js";
// eslint-disable-next-line no-unused-vars
import PolygonEffect from "./polygonEffect.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../../lib/graphics.js";

export default abstract class PolygonGroup extends DrawGroup<Polygon> {
	protected readonly transformSize: number;
	protected readonly colorSize: number;

	protected polygonEffect: PolygonEffect;

	constructor(
		graphics: Graphics.GraphicsManager,
		polygonEffect: PolygonEffect,
		batchExecution: number,
		batchSize: number
	) {
		super(graphics, batchExecution, batchSize);

		this.transformSize = 12;
		this.colorSize = 4;

		this.polygonEffect = polygonEffect;

		Object.defineProperty(this, "transformSize", {
			writable: false,
		});
		Object.defineProperty(this, "colorSize", {
			writable: false,
		});
	}

	protected calculateTransformData(polygon: Polygon) {
		return [
			polygon.width * polygon.scale.x,
			polygon.height * polygon.scale.y,
			polygon.scale.z,
			polygon.position.x + polygon.translation.x,
			polygon.position.y + polygon.translation.y,
			polygon.position.z + polygon.translation.z,
			polygon.origin.x,
			polygon.origin.y,
			polygon.origin.z,
			polygon.rotation.x,
			polygon.rotation.y,
			polygon.rotation.z,
		];
	}

	protected calculateColorData(polygon: Polygon) {
		return polygon.color.toArray();
	}
}
