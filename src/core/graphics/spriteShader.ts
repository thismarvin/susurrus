const SPRITE_SHADERS = {
	VERTEX: `
        uniform mat4 worldViewProjection;

				attribute vec3 a_position;
				attribute vec2 a_textureCoord;

        varying highp vec2 v_textureCoord;

        void main() {
					gl_Position = worldViewProjection * vec4(a_position, 1);

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
