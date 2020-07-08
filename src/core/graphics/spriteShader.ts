const SPRITE_SHADERS = {
	VERTEX: `
		uniform mat4 worldViewProjection;

		attribute vec3 a_vertexPosition;
		attribute vec2 a_textureCoord;
		attribute vec3 a_scale;

		varying highp vec2 v_textureCoord;

		mat4 createScale(vec3 scale) {
			return mat4(
					scale.x, 0, 0, 0,
					0, scale.y, 0, 0,
					0, 0, scale.z, 0,
					0, 0, 0, 1
			);
		}

		void main() {
			mat4 model = createScale(a_scale);
			gl_Position = worldViewProjection * model * vec4(a_vertexPosition, 1);

			v_textureCoord = a_textureCoord;
		}
		`,
	FRAGMENT: `
		uniform sampler2D sampler;

		varying highp vec2 v_textureCoord;

		void main() {
			gl_FragColor = texture2D(sampler, v_textureCoord);
		}
    `,
};

Object.freeze(SPRITE_SHADERS);

export { SPRITE_SHADERS as default };
