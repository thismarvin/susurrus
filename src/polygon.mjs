import AttributeTypes from "./attributeTypes.mjs";
import AttributeSchema from "./attributeSchema.mjs";
import AttributeElement from "./attributeElement.mjs";
import VertexUsage from "./vertexUsage.mjs";
import VertexBuffer from "./vertexBuffer.mjs";
import Vector3 from "./vector3.mjs";
import Color from "./color.mjs";

export default class Polygon {
    constructor(graphics, geometry) {
        this.geometry = geometry;

        this.attributeSchema = new AttributeSchema([
            new AttributeElement("a_translation", 3, AttributeTypes.FLOAT),
            new AttributeElement("a_scale", 3, AttributeTypes.FLOAT),
            new AttributeElement("a_rotationOffset", 3, AttributeTypes.FLOAT),
            new AttributeElement("a_rotation", 1, AttributeTypes.FLOAT),
            new AttributeElement("a_color", 4, AttributeTypes.FLOAT)
        ]);

        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotationOffset = new Vector3(0, 0, 0);
        this.rotation = 0;
        this.color = new Color(0xFF0000);

        this.transformBuffer = new VertexBuffer(graphics, this.attributeSchema, this.attributeSchema.size * 1, VertexUsage.DYNAMIC, 1);
    }

    update() {
        this.rotation += 0.01;

        const mutationData = [].concat(
            this.position.toArray(),
            this.scale.toArray(),
            this.rotationOffset.toArray(),
            this.rotation,
            this.color.toArray()
        );

        this.transformBuffer.setData(mutationData);
    }

    draw(graphics, effect, camera) {
        graphics.begin(effect);

        graphics.setVertexBuffers([this.geometry.vertexBuffer, this.transformBuffer]);
        graphics.setIndexBuffer(this.geometry.indexBuffer);

        graphics.setUniform("worldViewProjection", camera.worldViewProjection.data);

        graphics.drawElements(graphics.gl.TRIANGLES, this.geometry.totalTriangles, 0);

        graphics.end();
    }
}