import BatchExecution from "./batchExecution.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../camera.js";
// eslint-disable-next-line no-unused-vars
import * as Graphics from "../../lib/graphics.js";

export default abstract class Batcher<T> {
	protected readonly graphics: Graphics.GraphicsManager;
	protected batchExecution: number;
	protected batchSize: number;
	protected camera: Camera | null;

	constructor(graphics: Graphics.GraphicsManager) {
		this.graphics = graphics;

		this.batchExecution = BatchExecution.DRAW_ELEMENTS;
		this.batchSize = 4096;
		this.camera = null;

		Object.defineProperty(this, "graphics", {
			writable: false,
		});
	}

	public abstract begin(): Batcher<T>;
	public abstract add(entry: T): Batcher<T>;
	public abstract end(): Batcher<T>;

	public setBatchExecution(batchExecution: number) {
		this.batchExecution = batchExecution;

		return this;
	}

	public setBatchSize(batchSize: number) {
		this.batchSize = batchSize;

		return this;
	}

	public attachCamera(camera: Camera) {
		this.camera = camera;

		return this;
	}

	public addRange(entries: T[]) {
		for (let i = 0; i < entries.length; i++) {
			this.add(entries[i]);
		}

		return this;
	}
}
