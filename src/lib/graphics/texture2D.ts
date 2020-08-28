import * as WebGL from "./webGL.js";
// eslint-disable-next-line no-unused-vars
import GraphicsManager from "./graphicsManager.js";

export default class Texture2D {
	public get width() {
		return this.#width;
	}

	public get height() {
		return this.#height;
	}

	public get data() {
		return this.#data;
	}

	#width: number;
	#height: number;
	#data: WebGLTexture | null;

	constructor(width?: number, height?: number) {
		this.#width = 0;
		this.#height = 0;
		this.#data = null;

		if (width !== undefined) {
			this.#width = width;
		}

		if (height !== undefined) {
			this.#height = height;
		}
	}

	public setPixels(graphics: GraphicsManager, pixels: Uint8Array) {
		this.#data = WebGL.createTexture2D(
			graphics.gl,
			this.#width,
			this.height,
			pixels
		);
	}

	public static async fromURL(graphics: GraphicsManager, url: string) {
		const image = await WebGL.loadImage(url);
		const data = WebGL.createTexture2DFromImage(graphics.gl, image);
		const texture = new Texture2D(image.width, image.height);
		texture.#data = data;

		return texture;
	}
}
