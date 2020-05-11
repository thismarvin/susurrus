import { terser } from "rollup-plugin-terser";

export default [
	{
		input: "./build/susurrus.js",
		output: [
			{
				format: "umd",
				name: "Susurrus",
				file: "dist/susurrus.js",
			},
			{
				format: "umd",
				name: "Susurrus",
				file: "dist/susurrus.min.js",
				plugins: [terser()],
			},
			{
				format: "cjs",
				file: "dist/susurrus.common.js",
			},
			{
				format: "cjs",
				file: "dist/susurrus.common.min.js",
				plugins: [terser()],
			},
			{
				format: "es",
				file: "dist/susurrus.esm.js",
			},
			{
				format: "es",
				file: "dist/susurrus.esm.min.js",
				plugins: [terser()],
			},
		],
	},
];
