// eslint-disable-next-line no-unused-vars
import IDisposable from "../IDisposable.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../camera.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../lib/graphics.js";

export default abstract class DrawGroup<T> implements IDisposable {
	public readonly graphics: Graphics.GraphicsManager;
	public readonly batchExecution: number;
	public readonly batchSize: number;

	#disposed: boolean;

	constructor(
		graphics: Graphics.GraphicsManager,
		batchExecution: number,
		batchSize: number
	) {
		this.graphics = graphics;
		this.batchExecution = batchExecution;
		this.batchSize = batchSize;

		this.#disposed = false;

		Object.defineProperty(this, "batchExecution", {
			writable: false,
		});
		Object.defineProperty(this, "batchSize", {
			writable: false,
		});
	}

	public abstract add(entry: T): boolean;
	public abstract applyChanges(): void;
	public abstract draw(camera: Camera): void;

	/**
	 * Adds a list of entries to the draw group.
	 * @param entries The list of entries to add to the draw group.
	 */
	public addRange(entries: T[]) {
		for (let i = 0; i < entries.length; i++) {
			this.add(entries[i]);
		}
	}

	protected onDispose() {}

	public dispose() {
		if (!this.#disposed) {
			this.onDispose();
			this.#disposed = true;
		}
	}
}
