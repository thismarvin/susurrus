export default class Polygon {
    constructor(data) {        
        this.data = data;        
    }

    draw(graphics, effect, camera) {
        graphics.setBuffer(this.data.vertexBuffer);

        graphics.apply(effect.program);        

        graphics.setAttribute("position");
        graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);

        graphics.drawPrimitives(graphics.gl.TRIANGLES, 0, 3);
    }
}