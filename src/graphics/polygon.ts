import * as PropertyAssent from "../utilities/propertyAssent.js";
import AttributeType from "./attributeType.js";
import AttributeSchema from "./attributeSchema.js";
import AttributeElement from "./attributeElement.js";
import DrawMode from "./drawMode.js";
import VertexUsage from "./vertexUsage.js";
import VertexBuffer from "./vertexBuffer.js";
import Vector3 from "../maths/vector3.js";
import Color from "./color.js";
// eslint-disable-next-line no-unused-vars
import PolygonData from "./polygonData.js";
// eslint-disable-next-line no-unused-vars
import Graphics from "./graphics.js";
// eslint-disable-next-line no-unused-vars
import Effect from "./effect.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../utilities/camera.js";

const polygonProperties = new Set([
	"position",
	"scale",
	"rotationOffset",
	"rotation",
	"color",
]);

const proxySetTrap = {
	set(target: object, property: string, value: any) {
		// Again, this isn't really necessary. Although I do not want new properties being added! 😡
		if (!polygonProperties.has(property)) {
			throw new TypeError(
				`Polygon does not have a(n) '${property}' property; cannot set value.`
			);
		}

		const addendum = `Cannot set '${property}' property.`;

		// Validate values before setting them.
		switch (property) {
			case "position":
			case "scale":
			case "rotationOffset":
				PropertyAssent.expectInstance(value, Vector3, {
					addendum: addendum,
				});
				break;
			case "color":
				PropertyAssent.expectInstance(value, Color, {
					addendum: addendum,
				});
				break;
			case "rotation":
				PropertyAssent.expectType(value, "number", {
					addendum: addendum,
				});
				break;
		}

		// Passed validation; set the value now.
		return Reflect.set(target, property, value);
	},
};

const attributeSchema = new AttributeSchema([
	new AttributeElement("a_translation", 3, AttributeType.FLOAT),
	new AttributeElement("a_scale", 3, AttributeType.FLOAT),
	new AttributeElement("a_rotationOffset", 3, AttributeType.FLOAT),
	new AttributeElement("a_rotation", 1, AttributeType.FLOAT),
	new AttributeElement("a_color", 4, AttributeType.FLOAT),
]);

export default class Polygon {
	//#region Class Properties
	// public:
	// =======================
	// geometry; // readonly
	// attributeSchema; // readonly
	// transformBuffer; // readonly
	// position;
	// scale;
	// rotationOffset;
	// rotation;
	// color;

	// private:
	// =======================
	// _position;
	// _scale;
	// _rotationOffset;
	// _rotation;
	// _color;

	// _transformChanged;
	//#endregion

	public readonly geometry: PolygonData;
	public readonly attributeSchema: AttributeSchema;
	public readonly transformBuffer: VertexBuffer;

	get position() {
		return this.#position;
	}
	set position(value) {
		if (value === this.#position) {
			return;
		}

		this.#position = value;
		this.#transformChanged = true;
	}

	get scale() {
		return this.#scale;
	}
	set scale(value) {
		if (value === this.#scale) {
			return;
		}

		this.#scale = value;
		this.#transformChanged = true;
	}

	get rotationOffset() {
		return this.#rotationOffset;
	}
	set rotationOffset(value) {
		if (value === this.#rotationOffset) {
			return;
		}

		this.#rotationOffset = value;
		this.#transformChanged = true;
	}

	get rotation() {
		return this.#rotation;
	}
	set rotation(value) {
		if (value === this.#rotation) {
			return;
		}

		this.#rotation = value;
		this.#transformChanged = true;
	}

	get color() {
		return this.#color;
	}
	set color(value) {
		if (value === this.#color) {
			return;
		}

		this.#color = value;
		this.#transformChanged = true;
	}

	#position: Vector3;
	#scale: Vector3;
	#rotationOffset: Vector3;
	#rotation: number;
	#color: any; // TODO this needs to be Color eventually.
	#transformChanged: boolean;

	constructor(graphics: Graphics, geometry: PolygonData) {
		this.geometry = geometry;
		this.attributeSchema = attributeSchema;

		this.#position = new Vector3(0, 0, 0);
		this.#scale = new Vector3(1, 1, 1);
		this.#rotationOffset = new Vector3(0, 0, 0);
		this.#rotation = 0;
		this.#color = new Color(0xffffff);

		this.transformBuffer = new VertexBuffer(
			graphics,
			this.attributeSchema,
			this.attributeSchema.size * 1,
			VertexUsage.DYNAMIC,
			1
		);

		this.updateBuffer();
		this.#transformChanged = false;

		return new Proxy<Polygon>(this, proxySetTrap);
	}

	applyChanges() {
		if (!this.#transformChanged) {
			return;
		}

		this.#transformChanged = false;
		this.updateBuffer();
	}

	draw(graphics: Graphics, effect: Effect, camera: Camera) {
		// Ideally this would always be false, but I'll just keep this here in case the user ever forgets to applyChanges themselves.
		if (this.#transformChanged) {
			this.applyChanges();
		}

		graphics.begin(effect);

		graphics.setVertexBuffers([
			this.geometry.vertexBuffer,
			this.transformBuffer,
		]);
		graphics.setIndexBuffer(this.geometry.indexBuffer);

		graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);

		graphics.drawElements(DrawMode.TRIANGLES, this.geometry.totalTriangles, 0);

		graphics.end();
	}

	private updateBuffer() {
		const bufferData: number[] = [];
		bufferData.concat(this.#position.toArray());
		bufferData.concat(this.#scale.toArray());
		bufferData.concat(this.#rotationOffset.toArray());
		bufferData.concat(this.#rotation);
		bufferData.concat(this.#color.toArray());

		this.transformBuffer.setData(bufferData);
	}
}
