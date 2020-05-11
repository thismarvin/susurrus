import Effect from "./effect.js";
import Buffer from "./buffer.js";
import VertexBuffer from "./vertexBuffer.js";
import IndexBuffer from "./indexBuffer.js";
export default class Graphics {
	#private;
	readonly gl: WebGLRenderingContext;
	readonly extensions: any;
	constructor(gl: WebGLRenderingContext);
	clear(color: any): void;
	begin(effect: Effect): void;
	setVertexBuffer(buffer: VertexBuffer): void;
	setVertexBuffers(buffers: VertexBuffer[]): void;
	setIndexBuffer(buffer: IndexBuffer): void;
	setUniform(uniform: string, value: any): void;
	drawArrays(mode: number, offset: number, primitiveCount: number): void;
	drawElements(mode: number, totalTriangles: number, offset: number): void;
	drawInstancedElements(
		mode: number,
		totalTriangles: number,
		offset: number,
		primitiveCount: number
	): void;
	deleteBuffer(buffer: Buffer): void;
	end(): void;
}
