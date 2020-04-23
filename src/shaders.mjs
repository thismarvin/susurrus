const shaders = {
    "vertex": `
        uniform mat4 worldViewProjection;

        attribute vec3 a_position;
        attribute vec4 a_color;

        varying lowp vec4 v_color;

        void main() {
            gl_Position  = worldViewProjection * vec4(a_position, 1);
            v_color = a_color;
        }
    `,
    "fragment": `
        varying lowp vec4 v_color;

        void main() {
            gl_FragColor = v_color;
        }
    `
};

export { shaders as default };