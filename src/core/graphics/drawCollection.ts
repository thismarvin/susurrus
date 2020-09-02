// eslint-disable-next-line no-unused-vars
import IDisposable from "../IDisposable.js";
// eslint-disable-next-line no-unused-vars
import DrawGroup from "./drawGroup.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../camera.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../lib/graphics.js";

export default abstract class DrawCollection<T> implements IDisposable {
	protected readonly graphics: Graphics.GraphicsManager;
	protected readonly batchExecution: number;
	protected readonly batchSize: number;

	protected groups: DrawGroup<T>[];

	#disposed: boolean;

	constructor(
		graphics: Graphics.GraphicsManager,
		batchExecution: number,
		batchSize: number
	) {
		this.graphics = graphics;
		this.batchExecution = batchExecution;
		this.batchSize = batchSize;

		this.groups = [];

		this.#disposed = false;

		Object.defineProperty(this, "graphics", {
			writable: false,
		});
		Object.defineProperty(this, "batchExecution", {
			writable: false,
		});
		Object.defineProperty(this, "batchSize", {
			writable: false,
		});
	}

	protected abstract createDrawGroup(entry: T): DrawGroup<T>;

	public add(entry: T) {
		if (this.groups.length === 0) {
			this.groups.push(this.createDrawGroup(entry));
			this.groups[this.groups.length - 1].add(entry);

			return true;
		}

		if (this.groups[this.groups.length - 1].add(entry)) {
			return true;
		}

		this.groups.push(this.createDrawGroup(entry));
		this.groups[this.groups.length - 1].add(entry);

		return false;
	}

	public addRange(entries: T[]) {
		for (let i = 0; i < entries.length; i++) {
			this.add(entries[i]);
		}
	}

	public clear() {
		this.groups.splice(0);
	}

	public applyChanges() {
		for (let i = 0; i < this.groups.length; i++) {
			this.groups[i].applyChanges();
		}
	}

	public draw(camera: Camera) {
		for (let i = 0; i < this.groups.length; i++) {
			this.groups[i].draw(camera);
		}
	}

	public dispose() {
		if (!this.#disposed) {
			for (let i = 0; i < this.groups.length; i++) {
				this.groups[i].dispose();
			}
			this.#disposed = true;
		}
	}
}
