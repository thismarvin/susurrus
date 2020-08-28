export declare function getWebGLContext(
	canvas: HTMLCanvasElement
): WebGLRenderingContext;
export declare function createProgram(
	gl: WebGLRenderingContext,
	vertexShaderSource: string,
	fragmentShaderSource: string
): WebGLProgram;
export declare function allocateVertexBuffer(
	gl: WebGLRenderingContext,
	size: number,
	usage: number
): WebGLBuffer;
export declare function setVertexBufferData(
	gl: WebGLRenderingContext,
	buffer: WebGLBuffer,
	data: BufferSource
): void;
export declare function allocateIndexBuffer(
	gl: WebGLRenderingContext,
	size: number
): WebGLBuffer;
export declare function setIndexBufferData(
	gl: WebGLRenderingContext,
	buffer: WebGLBuffer,
	data: BufferSource
): void;
export declare function loadImage(url: string): Promise<HTMLImageElement>;
export declare function createTexture2D(
	gl: WebGLRenderingContext,
	width: number,
	height: number,
	pixels: Uint8Array
): WebGLTexture;
export declare function createTexture2DFromImage(
	gl: WebGLRenderingContext,
	image: HTMLImageElement
): WebGLTexture;
export declare function enablePremultipliedAlpha(
	gl: WebGLRenderingContext
): void;
export declare function clear(
	gl: WebGLRenderingContext,
	r: number,
	g: number,
	b: number,
	a: number
): void;
//# sourceMappingURL=webGL.d.ts.map
