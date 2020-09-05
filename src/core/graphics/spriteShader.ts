const SPRITE_SHADERS = {
	VERTEX: `
		uniform mat4 worldViewProjection;

		attribute vec3 a_vertexPosition;
		attribute vec3 a_scale;
		attribute vec3 a_translation;
		attribute vec3 a_origin;
		attribute vec3 a_rotation;
		attribute vec4 a_color;
		attribute vec2 a_textureCoord;

		varying lowp vec4 v_color;
		varying highp vec2 v_textureCoord;

		mat4 createTranslation(vec3 translation) {
			return mat4(
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				translation.x, translation.y, translation.z, 1
			);
		}

		mat4 createScale(vec3 scale) {
			return mat4(
				scale.x, 0, 0, 0,
				0, scale.y, 0, 0,
				0, 0, scale.z, 0,
				0, 0, 0, 1
			);
		}

		mat4 createRotation(vec3 rotation) {
			return mat4(
				cos(rotation.z) * cos(rotation.y), sin(rotation.z) * cos(rotation.y), -sin(rotation.y), 0,
				cos(rotation.z) * sin(rotation.y) * sin(rotation.x) - sin(rotation.z) * cos(rotation.x), sin(rotation.z) * sin(rotation.y) * sin(rotation.x) + cos(rotation.z) * cos(rotation.x), cos(rotation.y) * sin(rotation.x), 0,
				cos(rotation.z) * sin(rotation.y) * cos(rotation.x) + sin(rotation.z) * sin(rotation.x), sin(rotation.z) * sin(rotation.y) * cos(rotation.x) - cos(rotation.z) * sin(rotation.x), cos(rotation.y) * cos(rotation.x), 0,
				0, 0, 0, 1
			);
		}

		mat4 caclulateTransform(vec3 scale, vec3 translation, vec3 origin, vec3 rotation) {
			return createTranslation(translation + origin) * createRotation(rotation) * createTranslation(-origin) * createScale(scale);
		}

		void main() {
			mat4 transform = caclulateTransform(a_scale, a_translation, a_origin, a_rotation);
			gl_Position = worldViewProjection * transform * vec4(a_vertexPosition, 1);

			v_color = a_color;
			v_textureCoord = a_textureCoord;
		}
		`,
	FRAGMENT: `
		uniform sampler2D sampler;

		varying lowp vec4 v_color;
		varying highp vec2 v_textureCoord;

		void main() {
			gl_FragColor = texture2D(sampler, v_textureCoord) * v_color;
		}
    `,
};

Object.freeze(SPRITE_SHADERS);

export { SPRITE_SHADERS as default };
