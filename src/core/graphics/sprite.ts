import SpriteMirroringType from "./spriteMirroringType.js";
import * as Graphics from "../../lib/graphics.js";
import * as Maths from "../../lib/maths.js";

//const _attributeSchemaTexture = new Graphics.AttributeSchema([
//new Graphics.AttributeElement("a_textureCoord", 2, Graphics.AttributeType.FLOAT),
//]);

//const _attributeSchemaModel = new Graphics.AttributeSchema([
//new Graphics.AttributeElement("a_scale", 3, Graphics.AttributeType.FLOAT),
//]);

export default class Sprite {
	get width() {
		return this.#sampleRegion.width;
	}
	get height() {
		return this.#sampleRegion.height;
	}

	#texture: Graphics.Texture2D | null;
	#texelWidth: number;
	#texelHeight: number;

	#position: Maths.Vector3;
	#scale: Maths.Vector3;
	#translation: Maths.Vector3;
	#origin: Maths.Vector3;
	#rotation: Maths.Vector3;
	#color: Graphics.Color;

	#sampleRegion: Graphics.ImageRegion;
	#spriteMirroring: number;

	constructor() {
		this.#texture = null;
		this.#texelWidth = 0;
		this.#texelHeight = 0;

		this.#position = new Maths.Vector3(0, 0, 0);
		this.#scale = new Maths.Vector3(1, 1, 1);
		this.#translation = new Maths.Vector3(0, 0, 0);
		this.#origin = new Maths.Vector3(0, 0, 0);
		this.#rotation = new Maths.Vector3(0, 0, 0);
		this.#color = new Graphics.Color(0xffffff);

		this.#sampleRegion = new Graphics.ImageRegion(0, 0, 0, 0);
		this.#spriteMirroring = SpriteMirroringType.NONE;
	}

	//public createTextureBuffer(graphics: GraphicsManager) {
	//this.#textureBuffer = new VertexBuffer(
	//graphics,
	//_attributeSchemaTexture,
	//8,
	//VertexUsage.STATIC
	//);
	//this.#textureBuffer.setData([0, 0, 1, 0, 1, 1, 0, 1]);

	//let modelLength = _attributeSchemaModel.size;
	//if (Utilities.BrowserDetection.IS_BLINK) {
	//modelLength *= 6;
	//}
	//this.#modelBuffer = new VertexBuffer(
	//graphics,
	//_attributeSchemaModel,
	//modelLength,
	//VertexUsage.DYNAMIC,
	//1
	//);
	//this.#modelBuffer.setData([this.#texture.width, this.#texture.height, 1]);

	//return this;
	//}

	//public draw(graphics: GraphicsManager, camera: Camera) {
	//if (
	//this.#texture.data === null ||
	//this.#geometryData === null ||
	//this.#effect === null ||
	//this.#textureBuffer === null ||
	//this.#modelBuffer === null
	//) {
	//return;
	//}

	//graphics
	//.begin(this.#effect)
	//.setVertexBuffer(
	//this.#geometryData.vertexBuffer,
	//this.#textureBuffer,
	//this.#modelBuffer
	//)
	//.setIndexBuffer(this.#geometryData.indexBuffer)
	//.setUniform("worldViewProjection", camera.wvp.data)
	//.setUniform2("sampler")
	//.setTexture(this.#texture.data)
	//.drawElements(DrawMode.TRIANGLES, this.#geometryData.totalTriangles, 0)
	//.end();
	//}
}
