import AttributeTypes from "./attributeTypes.mjs";
import AttributeSchema from "./attributeSchema.mjs";
import AttributeElement from "./attributeElement.mjs";
import Buffer from "./buffer.mjs";

export default class Polygon {
    constructor(data) {
        this.data = data;
    }

    draw(graphics, effect, camera) {

        const attributeSchema = new AttributeSchema([
            new AttributeElement("a_color", 1, AttributeTypes.FLOAT, 0, 0)
        ]);

        const colorBuffer = new Buffer(graphics, attributeSchema, [1, 0, 0], 1);

        graphics.apply(effect.program);
        graphics.bindBuffer(this.data.vertexBuffer);
        graphics.bindBuffer(colorBuffer);
        graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);
        graphics.drawPrimitives(graphics.gl.TRIANGLES, 0, 3);
    }
}