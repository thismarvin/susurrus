const POLYGON_SHADERS = {
	VERTEX: `
		uniform mat4 worldViewProjection;

		attribute vec3 a_vertexPosition;
		attribute vec3 a_translation;
		attribute vec3 a_scale;
		attribute vec3 a_rotationOffset;
		attribute float a_rotation;
		attribute vec4 a_color;

		varying lowp vec4 v_color;

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

		mat4 createRotationZ(float theta) {
			return mat4(
				cos(theta), -sin(theta), 0, 0,
				sin(theta), cos(theta), 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			);
		}

		void main() {
			mat4 model = createTranslation(a_translation - a_rotationOffset) * createRotationZ(a_rotation) * createTranslation(a_rotationOffset) * createScale(a_scale);
			gl_Position = worldViewProjection * model * vec4(a_vertexPosition, 1);

			v_color = a_color;
		}
	`,
	FRAGMENT: `
		varying lowp vec4 v_color;

		void main() {
			gl_FragColor = v_color;
		}
	`,
};

Object.freeze(POLYGON_SHADERS);

export { POLYGON_SHADERS as default };
