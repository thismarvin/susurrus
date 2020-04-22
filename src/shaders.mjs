const shaders = {
    "vertex": `
        attribute vec3 position;

        uniform mat4 worldViewProjection;

        void main() {
            gl_Position  = worldViewProjection * vec4(position, 1);
        }
    `,
    "fragment": `
        void main() {
            gl_FragColor = vec4(0, 0, 0, 1);
        }
    `
};

export { shaders as default };