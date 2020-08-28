import * as Graphics from "../../../lib/graphics.js";
import GeometryData from "./geometryData.js";
export default class GeometryManager {
	#private;
	constructor(graphics: Graphics.GraphicsManager);
	registerGeometry(name: string, geometry: GeometryData): this;
	getGeometry(name: string): GeometryData | undefined;
	removeGeometry(name: string): this;
	private createDefaults;
}
//# sourceMappingURL=geometryManager.d.ts.map
