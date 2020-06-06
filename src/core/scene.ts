// eslint-disable-next-line no-unused-vars
import * as Graphics from "../lib/graphics.js";
// eslint-disable-next-line no-unused-vars
import Theater from "./theater.js";

export default abstract class Scene {
	public readonly name: string;
	public readonly theater: Theater;

	constructor(name: string, theater: Theater) {
		this.name = name;
		this.theater = theater;

		Object.defineProperty(this, "name", {
			writable: false,
		});
		Object.defineProperty(this, "theater", {
			writable: false,
		});
	}

	public onEnter() {}
	public onExit() {}

	/**
	 * A method called once every frame, before draw, that is typically used to perform runtime calculations and logic.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	public abstract update(deltaTime: number): void;
	/**
	 * A method called once every frame, after update, that is typically used to present visuals.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	public abstract draw(
		graphics: Graphics.GraphicsManager,
		deltaTime: number
	): void;
}
