import Color from "./color.js";
import Effect from "./effect.js";
import VertexBuffer from "./vertexBuffer.js";
import IndexBuffer from "./indexBuffer.js";
export default class Graphics {
	#private;
	readonly gl: WebGLRenderingContext;
	readonly extensions: any;
	get drawWidth(): number;
	get drawHeight(): number;
	get scale(): number;
	private get isLandscape();
	constructor(gl: WebGLRenderingContext);
	setCanvasDimensions(width: number, height: number): this;
	setResolution(width: number, height: number): this;
	clear(color: Color): void;
	begin(effect: Effect): this;
	setVertexBuffer(...buffers: VertexBuffer[]): this;
	setIndexBuffer(buffer: IndexBuffer): this;
	setUniform(uniform: string, value: any): this;
	setUniform2(uniform: string): this;
	setTexture(texture: WebGLTexture): this;
	drawArrays(mode: number, offset: number, primitiveCount: number): this;
	drawElements(mode: number, totalTriangles: number, offset: number): this;
	drawInstancedElements(
		mode: number,
		totalTriangles: number,
		offset: number,
		primitiveCount: number
	): this;
	disableVertexBuffer(...buffers: VertexBuffer[]): this;
	end(): void;
}
//# sourceMappingURL=graphicsManager.d.ts.map
