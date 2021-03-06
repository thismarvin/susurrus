import Graphics from "./graphicsManager.js";
export default abstract class Buffer {
	#private;
	readonly length: number;
	readonly type: number;
	buffer: WebGLBuffer | null;
	protected data: Float32Array | Int16Array | null;
	constructor(graphics: Graphics, length: number, type: number);
	setData(data: number[]): void;
}
//# sourceMappingURL=buffer.d.ts.map
