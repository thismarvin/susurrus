export default [{
    input: './src/susurrus.mjs',
    output: [{
        format: 'umd',
        name: "Susurrus",
        file: 'dist/susurrus.js'
    }]
}, {
    input: './src/susurrus.mjs',
    output: [{
        format: 'es',
        file: 'dist/susurrus.module.js'
    }]
}];