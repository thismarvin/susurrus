import GraphicsManager from "./graphicsManager.js";
export default class Texture2D {
	#private;
	get width(): number;
	get height(): number;
	get data(): WebGLTexture | null;
	constructor(width?: number, height?: number);
	setPixels(graphics: GraphicsManager, pixels: Uint8Array): void;
	static fromURL(graphics: GraphicsManager, url: string): Promise<Texture2D>;
}
//# sourceMappingURL=texture2D.d.ts.map
