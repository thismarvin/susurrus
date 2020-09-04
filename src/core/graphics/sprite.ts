import SpriteMirroringType from "./spriteMirroringType.js";
import ImageRegion from "./imageRegion.js";
import * as Graphics from "../../lib/graphics.js";
import * as Maths from "../../lib/maths.js";

//const _attributeSchemaTexture = new Graphics.AttributeSchema([
//new Graphics.AttributeElement("a_textureCoord", 2, Graphics.AttributeType.FLOAT),
//]);

//const _attributeSchemaModel = new Graphics.AttributeSchema([
//new Graphics.AttributeElement("a_scale", 3, Graphics.AttributeType.FLOAT),
//]);

export default class Sprite {
	get texture() {
		return this.#texture;
	}
	set texture(value) {
		this.setTexture(value);
	}

	get sampleRegion() {
		return this.#sampleRegion;
	}
	set sampleRegion(value) {
		this.setSampleRegion(value.x, value.y, value.width, value.height);
	}

	get spriteMirroring() {
		return this.#spriteMirroring;
	}
	set spriteMirroring(value) {
		this.setSpriteMirroring(value);
	}

	get position() {
		return this.#position;
	}
	set position(value) {
		this.setPosition(value.x, value.y, value.z);
	}

	get x() {
		return this.#position.x;
	}
	set x(value) {
		this.setPosition(value, this.#position.y, this.#position.z);
	}
	get y() {
		return this.#position.y;
	}
	set y(value) {
		this.setPosition(this.#position.x, value, this.#position.z);
	}
	get z() {
		return this.#position.z;
	}
	set z(value) {
		this.setPosition(this.#position.x, this.#position.y, value);
	}

	get scale() {
		return this.#scale;
	}
	set scale(value) {
		this.setScale(value.x, value.y, value.z);
	}

	get translation() {
		return this.#translation;
	}
	set translation(value) {
		this.setTranslation(value.x, value.y, value.z);
	}

	get origin() {
		return this.#origin;
	}
	set origin(value) {
		this.setOrigin(value.x, value.y, value.z);
	}

	get rotation() {
		return this.#rotation;
	}
	set rotation(value) {
		this.setRotation(value.x, value.y, value.z);
	}

	get tint() {
		return this.#tint;
	}
	set tint(value) {
		this.setTint(value);
	}

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
	#tint: Graphics.Color;

	#sampleRegion: ImageRegion;
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
		this.#tint = new Graphics.Color(0xffffff);

		this.#sampleRegion = new ImageRegion(0, 0, 0, 0);
		this.#spriteMirroring = SpriteMirroringType.NONE;
	}

	public setTexture(texture: Graphics.Texture2D) {
		this.#texture = texture;
		this.#texelWidth = 1.0 / texture.width;
		this.#texelHeight = 1.0 / texture.height;

		return this;
	}

	public setSampleRegion(x: number, y: number, width: number, height: number) {
		this.#sampleRegion.x = x;
		this.#sampleRegion.y = y;
		this.#sampleRegion.width = width;
		this.#sampleRegion.height = height;

		return this;
	}

	public setSpriteMirroring(mirroringType: number) {
		this.#spriteMirroring = mirroringType;

		return this;
	}

	public setPosition(x: number, y: number, z: number) {
		this.#position.x = x;
		this.#position.y = y;
		this.#position.z = z;

		return this;
	}

	public setTint(tint: Graphics.Color) {
		this.#tint = tint;

		return this;
	}

	public setScale(x: number, y: number, z: number) {
		this.#scale.x = x;
		this.#scale.y = y;
		this.#scale.z = z;

		return this;
	}

	public setTranslation(x: number, y: number, z: number) {
		this.#translation.x = x;
		this.#translation.y = y;
		this.#translation.z = z;

		return this;
	}

	public setOrigin(x: number, y: number, z: number) {
		this.#origin.x = x;
		this.#origin.y = y;
		this.#origin.z = z;

		return this;
	}

	public setRotation(roll: number, pitch: number, yaw: number) {
		this.#rotation.x = roll;
		this.#rotation.y = pitch;
		this.#rotation.z = yaw;

		return this;
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
