import * as Graphics from "../lib/graphics.js";
import * as Input from "../lib/input.js";
import SceneManager from "./sceneManager.js";
import GeometryManager from "./graphics/geometry/geometryManager.js";
import Factory from "./factory.js";
export default class Theater {
	#private;
	readonly smartKeyboard: Input.SmartKeyboard;
	readonly smartPointer: Input.SmartPointer;
	readonly sceneManager: SceneManager;
	readonly factory: Factory;
	loop: boolean;
	get parent(): HTMLElement | null;
	get canvas(): HTMLCanvasElement | null;
	get graphics(): Graphics.GraphicsManager | null;
	get geometryManager(): GeometryManager | null;
	get inFocus(): boolean;
	get totalElapsedTime(): number;
	get args(): string[];
	constructor();
	/**
	 * Jumpstarts the runtime of your project.
	 * @param args An optional string that serves as command-line arguments for the theater.
	 */
	run(args?: string): void;
	/**
	 * Finds an HTMLElement with a given id, and sets the element as the parent of the theater.
	 * Any HTMLElements created using this theater will be appended to said parent.
	 * @param id The id of an existing HTMLElement on the current page.
	 */
	setParent(id: string): this;
	/**
	 * Creates and appends a new HTMLCanvas to the theater's parent HTMLElement.
	 * Moreover, a valid GraphicsManager is created and initialized.
	 * @param id The id the new HTMLCanvas should have.
	 * @param width The width of the new HTMLCanvas.
	 * @param height The height of the new HTMLCanvas.
	 */
	createCanvas(id: string, width: number, height: number): void;
	/**
	 * A method that is called once at the start of runtime that is typically used to setup your project.
	 */
	initialize(): void;
	/**
	 * A method called once every frame, before draw, that is typically used to perform runtime calculations and logic.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	update(deltaTime: number): void;
	/**
	 * A method called once every frame, after update, that is typically used to present visuals.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	draw(deltaTime: number): void;
	/**
	 * Code that is integral to the engine that is guaranteed to be updated every frame.
	 * @param deltaTime The total amount of time, in seconds, that has elapsed between updates.
	 */
	private managedUpdate;
	private main;
}
//# sourceMappingURL=theater.d.ts.map
