import * as WebGL from "./graphics/webGL.mjs";
import Graphics from "./graphics.mjs";

export default class Sketch {
    constructor(id) {
        this.parent = document.getElementById(id);
        this.canvas = document.createElement("canvas");
        this.parent.appendChild(this.canvas);
        this.canvas.id = `${id}-canvas`;
        this.canvas.width = 400;
        this.canvas.height = 400;

        this.graphics = new Graphics(WebGL.getWebGLContext(`${id}-canvas`));

        this.initialized = false;
        this.running = true;
    }

    run() {
        if (!this.initialized) {
            this.initialize();
            this.initialized = true;
        }

        this.update();
        this.draw();

        if (this.running) {
            window.requestAnimationFrame(this.run.bind(this));
        }
    }

    initialize() {

    }

    update() {

    }

    draw() {

    }
}