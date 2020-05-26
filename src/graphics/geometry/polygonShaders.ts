const polygonShaders = {
	vertex: `
        uniform mat4 worldViewProjection;

        attribute vec3 a_position;
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
						mat4 transform = createTranslation(a_translation - a_rotationOffset) * createRotationZ(a_rotation) * createTranslation(a_rotationOffset) * createScale(a_scale);
            gl_Position =  worldViewProjection * transform * vec4(a_position, 1);
            v_color = a_color;
        }
    `,
	fragment: `
        varying lowp vec4 v_color;

        void main() {
            gl_FragColor = v_color;
        }
    `,
};

Object.freeze(polygonShaders);

export { polygonShaders as default };
