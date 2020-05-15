// eslint-disable-next-line no-unused-vars
import Scene from "./scene.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "../graphics/graphics.js";

export default class SceneManager {
	public readonly scenes: Map<string, Scene>;

	#transitionInProgress: boolean;
	#currentScene: Scene | null;
	#nextScene: Scene | null;

	constructor() {
		this.scenes = new Map<string, Scene>();

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

	public registerScene(scene: Scene) {
		if (this.scenes.has(scene.name)) {
			throw new TypeError(
				"A scene with that name has already been registered."
			);
		}

		this.scenes.set(scene.name, scene);
	}

	public queueScene(name: string) {
		if (!this.scenes.has(name)) {
			throw new TypeError("A scene with that name does not exist.");
		}

		this.#nextScene = this.scenes.get(name) as Scene;
		this.#transitionInProgress = true;
	}

	public update(deltaTime: number) {
		this.updateTransitions();
		this.#currentScene?.update(deltaTime);
	}

	public draw(graphics: Graphics, deltaTime: number) {
		this.#currentScene?.draw(graphics, deltaTime);
	}

	private updateTransitions() {
		if (!this.#transitionInProgress) {
			return;
		}

		// * This is temporary for now since transitions do not exist 😉
		this.#currentScene = this.#nextScene;
		this.#transitionInProgress = false;
	}
}
