import * as Graphics from "../../../lib/graphics.js";

export const VERTEX_POSITION = new Graphics.AttributeSchema([
	new Graphics.AttributeElement(
		"a_vertexPosition",
		3,
		Graphics.AttributeType.FLOAT
	),
]);

export const TRANSFORM = new Graphics.AttributeSchema([
	new Graphics.AttributeElement("a_scale", 3, Graphics.AttributeType.FLOAT),
	new Graphics.AttributeElement(
		"a_translation",
		3,
		Graphics.AttributeType.FLOAT
	),
	new Graphics.AttributeElement("a_origin", 3, Graphics.AttributeType.FLOAT),
	new Graphics.AttributeElement("a_rotation", 3, Graphics.AttributeType.FLOAT),
]);

export const COLOR = new Graphics.AttributeSchema([
	new Graphics.AttributeElement("a_color", 4, Graphics.AttributeType.FLOAT),
]);
