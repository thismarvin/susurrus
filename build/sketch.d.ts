import Graphics from "./graphics/graphics.js";
export default class Sketch {
    #private;
    readonly parent: HTMLElement;
    readonly canvas: HTMLCanvasElement;
    readonly graphics: Graphics;
    loop: boolean;
    constructor(id: string);
    run(): void;
    initialize(): void;
    update(): void;
    draw(): void;
}
