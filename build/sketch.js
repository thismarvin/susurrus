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
var _initialized;
import * as WebGL from "./graphics/webGL.js";
import Graphics from "./graphics/graphics.js";
export default class Sketch {
    constructor(id) {
        _initialized.set(this, void 0);
        const element = document.getElementById(id);
        if (element === null) {
            throw new TypeError(`Could not find an element with an id of '${id}'.`);
        }
        this.parent = element;
        this.canvas = document.createElement("canvas");
        this.parent.appendChild(this.canvas);
        this.canvas.id = `${id}-canvas`;
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.graphics = new Graphics(WebGL.getWebGLContext(this.canvas));
        __classPrivateFieldSet(this, _initialized, false);
        this.loop = true;
        Object.defineProperty(this, "parent", {
            writable: false,
        });
        Object.defineProperty(this, "canvas", {
            writable: false,
        });
        Object.defineProperty(this, "graphics", {
            writable: false,
        });
    }
    run() {
        if (!__classPrivateFieldGet(this, _initialized)) {
            this.initialize();
            __classPrivateFieldSet(this, _initialized, true);
        }
        this.update();
        this.draw();
        if (this.loop) {
            window.requestAnimationFrame(this.run.bind(this));
        }
    }
    initialize() { }
    update() { }
    draw() { }
}
_initialized = new WeakMap();
