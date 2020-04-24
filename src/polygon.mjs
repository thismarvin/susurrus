import AttributeTypes from "./attributeTypes.mjs";
import AttributeSchema from "./attributeSchema.mjs";
import AttributeElement from "./attributeElement.mjs";
import Buffer from "./buffer.mjs";
import Vector3 from "./vector3.mjs";
import Color from "./color.mjs";

export default class Polygon {
    constructor(geometry) {
        this.geometry = geometry;

        this.attributeSchema = new AttributeSchema([
            new AttributeElement("a_translation", 3, AttributeTypes.FLOAT, 4, 0),
            new AttributeElement("a_scale", 3, AttributeTypes.FLOAT, 4, 12),
            new AttributeElement("a_rotationOffset", 3, AttributeTypes.FLOAT, 4, 24),
            new AttributeElement("a_rotation", 1, AttributeTypes.FLOAT, 4, 36),
            new AttributeElement("a_color", 4, AttributeTypes.FLOAT, 4, 40)
        ]);

        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotationOffset = new Vector3(0, 0, 0);
        this.rotation = 0;
        this.color = Color.fromHex(0xFF004D);
    }

    update() {
        this.rotation += 0.01;
    }

    draw(graphics, effect, camera) {
        const mutationData = [].concat(
            this.position.toArray(),
            this.scale.toArray(),
            this.rotationOffset.toArray(),
            this.rotation,
            this.color.toArray(),
        );

        const mutationBuffer = new Buffer(
            graphics,
            this.attributeSchema,
            mutationData,
            1
        );

        graphics.apply(effect.program);
        graphics.bindBuffer(this.geometry.vertexBuffer);
        graphics.bindBuffer(mutationBuffer);
        graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);
        graphics.drawPrimitives(graphics.gl.TRIANGLES, 0, 3);
    }
}