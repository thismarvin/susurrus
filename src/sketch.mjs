import Graphics from "./graphics.mjs";

export default class Sketch {
    constructor(id) {
        this.parent = document.getElementById(id);
        this.canvas = document.createElement("canvas");
        this.parent.appendChild(this.canvas);    
        this.canvas.width = 400;
        this.canvas.height = 400;

        this.gl = this.canvas.getContext("webgl");

        if (this.gl === null) {
            throw new Error("WebGL is not supported on this device.");            
        }        

        this.graphics = new Graphics(this.gl);
    }    

    draw() {
        
    }
}