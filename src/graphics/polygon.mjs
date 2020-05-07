import * as PropertyAssent from "../utilities/propertyAssent.mjs";
import AttributeType from "./attributeType.mjs";
import AttributeSchema from "./attributeSchema.mjs";
import AttributeElement from "./attributeElement.mjs";
import DrawMode from "./drawMode.mjs";
import VertexUsage from "./vertexUsage.mjs";
import VertexBuffer from "./vertexBuffer.mjs";
import Vector3 from "../maths/vector3.mjs";
import Color from "./color.mjs";

const polygonProperties = new Set([
	"position",
	"scale",
	"rotationOffset",
	"rotation",
	"color",
	"_position",
	"_scale",
	"_rotationOffset",
	"_rotation",
	"_color",
	"_transformChanged",
]);

const proxySetTrap = {
	set(target, property, value) {
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
			case "_position":
			case "scale":
			case "_scale":
			case "rotationOffset":
			case "_rotationOffset":
				PropertyAssent.expectInstance(value, Vector3, {
					addendum: addendum,
				});
				break;
			case "color":
			case "_color":
				PropertyAssent.expectInstance(value, Color, {
					addendum: addendum,
				});
				break;
			case "rotation":
			case "_rotation":
				PropertyAssent.expectType(value, "number", {
					addendum: addendum,
				});
				break;
			case "_transformChanged":
				PropertyAssent.expectType(value, "boolean", {
					addendum: addendum,
				});
				break;
		}

		// Passed validation; set the value now.
		return Reflect.set(target, property, value);
	},
};

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

	constructor(graphics, geometry) {
		Object.defineProperty(this, "geometry", {
			value: geometry,
			writable: false,
		});

		Object.defineProperty(this, "attributeSchema", {
			value: new AttributeSchema([
				new AttributeElement("a_translation", 3, AttributeType.FLOAT),
				new AttributeElement("a_scale", 3, AttributeType.FLOAT),
				new AttributeElement("a_rotationOffset", 3, AttributeType.FLOAT),
				new AttributeElement("a_rotation", 1, AttributeType.FLOAT),
				new AttributeElement("a_color", 4, AttributeType.FLOAT),
			]),
			writable: false,
		});

		Object.defineProperty(this, "position", {
			get() {
				return this._position;
			},
			set(value) {
				if (this._position === value) {
					return;
				}

				this._position = value;
				this._transformChanged = true;
			},
		});

		Object.defineProperty(this, "scale", {
			get() {
				return this._scale;
			},
			set(value) {
				if (this._scale === value) {
					return;
				}

				this._scale = value;
				this._transformChanged = true;
			},
		});

		Object.defineProperty(this, "rotationOffset", {
			get() {
				return this._rotationOffset;
			},
			set(value) {
				if (this._rotationOffset === value) {
					return;
				}

				this._rotationOffset = value;
				this._transformChanged = true;
			},
		});

		Object.defineProperty(this, "rotation", {
			get() {
				return this._rotation;
			},
			set(value) {
				if (this._rotation === value) {
					return;
				}

				this._rotation = value;
				this._transformChanged = true;
			},
		});

		Object.defineProperty(this, "color", {
			get() {
				return this._color;
			},
			set(value) {
				if (this._color === value) {
					return;
				}

				this._color = value;
				this._transformChanged = true;
			},
		});

		this._position = new Vector3(0, 0, 0);
		this._scale = new Vector3(1, 1, 1);
		this._rotationOffset = new Vector3(0, 0, 0);
		this._rotation = 0;
		this._color = new Color(0xffffff);

		Object.defineProperty(this, "transformBuffer", {
			value: new VertexBuffer(
				graphics,
				this.attributeSchema,
				this.attributeSchema.size * 1,
				VertexUsage.DYNAMIC,
				1
			),
			writable: false,
		});

		this._updateBuffer();
		this._transformChanged = false;

		return new Proxy(this, proxySetTrap);
	}

	applyChanges() {
		if (!this._transformChanged) {
			return;
		}

		this._transformChanged = false;
		this._updateBuffer();
	}

	draw(graphics, effect, camera) {
		// Ideally this would always be false, but I'll just keep this here in case the user ever forgets to applyChanges themselves.
		if (this._transformChanged) {
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

	_updateBuffer() {
		const bufferData = [].concat(
			this._position.toArray(),
			this._scale.toArray(),
			this._rotationOffset.toArray(),
			this._rotation,
			this._color.toArray()
		);

		this.transformBuffer.setData(bufferData);
	}
}
