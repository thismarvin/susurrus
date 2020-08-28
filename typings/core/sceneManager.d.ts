import { GraphicsManager } from "../lib/graphics.js";
import { ResourceHandler } from "../lib/utilities.js";
import Scene from "./scene.js";
export default class SceneManager {
	#private;
	readonly scenes: ResourceHandler<Scene>;
	constructor();
	register(...scenes: Scene[]): this;
	queue(name: string): void;
	update(deltaTime: number): void;
	draw(graphics: GraphicsManager, deltaTime: number): void;
	private updateTransitions;
}
//# sourceMappingURL=sceneManager.d.ts.map
