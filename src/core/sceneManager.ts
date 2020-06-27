// eslint-disable-next-line no-unused-vars
import { GraphicsManager } from "../lib/graphics.js";
import { ResourceHandler } from "../lib/utilities.js";
// eslint-disable-next-line no-unused-vars
import Scene from "./scene.js";

export default class SceneManager {
	public readonly scenes: ResourceHandler<Scene>;

	#transitionInProgress: boolean;
	#currentScene: Scene | null;
	#nextScene: Scene | null;

	constructor() {
		this.scenes = new ResourceHandler<Scene>();

		this.#transitionInProgress = false;
		this.#currentScene = null;
		this.#nextScene = null;

		Object.defineProperty(this, "scenes", {
			writable: false,
		});
		Object.defineProperty(this, "graphics", {
			writable: false,
		});
	}

	public register(...scenes: Scene[]) {
		for (let i = 0; i < scenes.length; i++) {
			this.scenes.register(scenes[i].name, scenes[i]);
		}

		return this;
	}

	public queue(name: string) {
		const scene = this.scenes.get(name);

		if (scene === undefined) {
			throw new Error("Something went wrong!");
		}

		this.#nextScene = scene;
		this.#transitionInProgress = true;
	}

	public update(deltaTime: number) {
		this.updateTransitions();
		this.#currentScene?.update(deltaTime);
	}

	public draw(graphics: GraphicsManager, deltaTime: number) {
		this.#currentScene?.draw(graphics, deltaTime);
	}

	private updateTransitions() {
		if (!this.#transitionInProgress) {
			return;
		}

		// * Below is all temporary for now since transitions do not exist 😉
		this.#currentScene?.onExit();
		this.#nextScene?.onEnter();

		this.#currentScene = this.#nextScene;
		this.#transitionInProgress = false;
	}
}
