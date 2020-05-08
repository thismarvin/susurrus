var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _position, _scale, _rotationOffset, _rotation, _color, _transformChanged;
import AttributeType from "./attributeType.js";
import AttributeSchema from "./attributeSchema.js";
import AttributeElement from "./attributeElement.js";
import DrawMode from "./drawMode.js";
import VertexUsage from "./vertexUsage.js";
import VertexBuffer from "./vertexBuffer.js";
import Vector3 from "../maths/vector3.js";
import Color from "./color.js";
const attributeSchema = new AttributeSchema([
    new AttributeElement("a_translation", 3, AttributeType.FLOAT),
    new AttributeElement("a_scale", 3, AttributeType.FLOAT),
    new AttributeElement("a_rotationOffset", 3, AttributeType.FLOAT),
    new AttributeElement("a_rotation", 1, AttributeType.FLOAT),
    new AttributeElement("a_color", 4, AttributeType.FLOAT),
]);
export default class Polygon {
    constructor(graphics, geometry) {
        _position.set(this, void 0);
        _scale.set(this, void 0);
        _rotationOffset.set(this, void 0);
        _rotation.set(this, void 0);
        _color.set(this, void 0);
        _transformChanged.set(this, void 0);
        this.geometry = geometry;
        this.attributeSchema = attributeSchema;
        __classPrivateFieldSet(this, _position, new Vector3(0, 0, 0));
        __classPrivateFieldSet(this, _scale, new Vector3(1, 1, 1));
        __classPrivateFieldSet(this, _rotationOffset, new Vector3(0, 0, 0));
        __classPrivateFieldSet(this, _rotation, 0);
        __classPrivateFieldSet(this, _color, new Color(0xffffff));
        this.transformBuffer = new VertexBuffer(graphics, this.attributeSchema, this.attributeSchema.size * 1, VertexUsage.DYNAMIC, 1);
        this.updateBuffer();
        __classPrivateFieldSet(this, _transformChanged, false);
        Object.defineProperty(this, "geometry", {
            writable: false,
        });
        Object.defineProperty(this, "attributeSchema", {
            writable: false,
        });
        Object.defineProperty(this, "transformBuffer", {
            writable: false,
        });
    }
    get position() {
        return __classPrivateFieldGet(this, _position);
    }
    set position(value) {
        if (value === __classPrivateFieldGet(this, _position)) {
            return;
        }
        __classPrivateFieldSet(this, _position, value);
        __classPrivateFieldSet(this, _transformChanged, true);
    }
    get scale() {
        return __classPrivateFieldGet(this, _scale);
    }
    set scale(value) {
        if (value === __classPrivateFieldGet(this, _scale)) {
            return;
        }
        __classPrivateFieldSet(this, _scale, value);
        __classPrivateFieldSet(this, _transformChanged, true);
    }
    get rotationOffset() {
        return __classPrivateFieldGet(this, _rotationOffset);
    }
    set rotationOffset(value) {
        if (value === __classPrivateFieldGet(this, _rotationOffset)) {
            return;
        }
        __classPrivateFieldSet(this, _rotationOffset, value);
        __classPrivateFieldSet(this, _transformChanged, true);
    }
    get rotation() {
        return __classPrivateFieldGet(this, _rotation);
    }
    set rotation(value) {
        if (value === __classPrivateFieldGet(this, _rotation)) {
            return;
        }
        __classPrivateFieldSet(this, _rotation, value);
        __classPrivateFieldSet(this, _transformChanged, true);
    }
    get color() {
        return __classPrivateFieldGet(this, _color);
    }
    set color(value) {
        if (value === __classPrivateFieldGet(this, _color)) {
            return;
        }
        __classPrivateFieldSet(this, _color, value);
        __classPrivateFieldSet(this, _transformChanged, true);
    }
    applyChanges() {
        // if (!this.#transformChanged) {
        // 	return;
        // }
        __classPrivateFieldSet(this, _transformChanged, false);
        this.updateBuffer();
    }
    draw(graphics, effect, camera) {
        // Ideally this would always be false, but I'll just keep this here in case the user ever forgets to applyChanges themselves.
        if (__classPrivateFieldGet(this, _transformChanged)) {
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
    updateBuffer() {
        let bufferData = [];
        bufferData = bufferData.concat(__classPrivateFieldGet(this, _position).toArray());
        bufferData = bufferData.concat(__classPrivateFieldGet(this, _scale).toArray());
        bufferData = bufferData.concat(__classPrivateFieldGet(this, _rotationOffset).toArray());
        bufferData = bufferData.concat(__classPrivateFieldGet(this, _rotation));
        bufferData = bufferData.concat(__classPrivateFieldGet(this, _color).toArray());
        this.transformBuffer.setData(bufferData);
    }
}
_position = new WeakMap(), _scale = new WeakMap(), _rotationOffset = new WeakMap(), _rotation = new WeakMap(), _color = new WeakMap(), _transformChanged = new WeakMap();
