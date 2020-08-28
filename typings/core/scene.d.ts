import * as Graphics from "../lib/graphics.js";
import Theater from "./theater.js";
export default abstract class Scene {
	readonly name: string;
	readonly theater: Theater;
	constructor(name: string, theater: Theater);
	onEnter(): void;
	onExit(): void;
	/**
	 * A method called once every frame, before draw, that is typically used to perform runtime calculations and logic.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	abstract update(deltaTime: number): void;
	/**
	 * A method called once every frame, after update, that is typically used to present visuals.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	abstract draw(graphics: Graphics.GraphicsManager, deltaTime: number): void;
}
//# sourceMappingURL=scene.d.ts.map
